import Dayjs from "dayjs";
import UtcPlugin from "dayjs/plugin/utc";
import IsSameOrBeforePlugin from "dayjs/plugin/isSameOrBefore";

Dayjs.extend(UtcPlugin);
Dayjs.extend(IsSameOrBeforePlugin);

export default Dayjs;