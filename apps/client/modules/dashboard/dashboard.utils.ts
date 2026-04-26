import dayjs from "dayjs";
import { atom } from "jotai";
import { type DateRange } from "react-day-picker";

export const dashboardFilterAtom = atom<DateRange | undefined>({
  from: dayjs().startOf("month").toDate(),
  to: dayjs().toDate(),
});
