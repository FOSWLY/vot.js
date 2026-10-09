import type { Lesson } from "@vot.js/shared/types/helpers/coursehunterLike";

export type CoursehunterLikeWindow = Window & {
  course_id?: number;
  lessons?: Lesson[];
};
