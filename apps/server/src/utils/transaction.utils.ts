import type {
  TransactionOrderByWithRelationInput,
  TransactionWhereInput,
} from "@/generated/prisma/models.js";
import type {
  ITransactionFilters,
  ITransactionSort,
} from "@/schema/transaction.schema.js";
import dayjs from "dayjs";
import { isEmpty, isNumber, toFloat } from "radash";

export function generateFiltersQuery(filters: ITransactionFilters) {
  let whereQuery: TransactionWhereInput = {};

  if (filters?.type) {
    whereQuery.type = filters.type;
  }

  if (filters?.category?.length) {
    whereQuery.categoryId = {
      in: filters.category,
    };
  }

  if (filters?.search) {
    const isSearchNumber = isNumber(Number(filters?.search));
    const searchNumber = toFloat(filters?.search);
    whereQuery.OR = [
      {
        description: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        category: {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      },
      isSearchNumber
        ? {
            amount: {
              equals: searchNumber,
            },
          }
        : {},
    ];
  }

  if (filters?.amount?.length) {
    const min = filters?.amount[0];
    const max = filters?.amount[1];
    if (!max) {
      whereQuery.amount = {
        gt: min,
      };
    } else {
      whereQuery.amount = {
        gt: min,
        lt: max,
      };
    }
  }

  if (!isEmpty(filters?.date) && filters?.date) {
    const start = filters?.date?.from;
    const end = filters?.date?.to;

    whereQuery.date = {
      gte: dayjs(start).startOf("day").toDate(),
      lte: dayjs(end).endOf("day").toDate(),
    };
  }

  return whereQuery;
}

export function generateSortQuery(sort: ITransactionSort) {
  const query:
    | TransactionOrderByWithRelationInput
    | TransactionOrderByWithRelationInput[]
    | undefined = [];

  if (!isEmpty(sort) && sort) {
    if (sort?.path === "category") {
      query.push({
        category: {
          name: sort.direction,
        },
      });
    } else {
      query.push({
        [sort.path]: sort.direction,
      });
    }
  } else {
    query.push({
      date: "desc",
    });
  }

  return query;
}
