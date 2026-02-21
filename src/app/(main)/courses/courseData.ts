export type CourseMatch = {
  type: "prefix" | "contains" | "equals";
  value: string;
};

export type CourseMeta = {
  slug?: string;
  title: string;
  subtitle: string;
  instructor: string;
  level: string;
  lastUpdated: string;
  heroVimeoId?: string;
  match?: CourseMatch;
};

export const defaultCourseMeta: CourseMeta = {
  title: "강의",
  subtitle:
    "하나님의 말씀을 깊이 묵상하고, 삶에 적용하는 체계적인 성경 훈련 과정입니다.",
  instructor: "킹덤바이블칼리지",
  level: "입문 - 초급",
  lastUpdated: "2026.02.01",
  heroVimeoId: "76979871",
};

export const courseCatalog: CourseMeta[] = [
  {
    slug: "post-encounter",
    title: "포스트인카운터",
    subtitle: "사역과 은혜의 여정을 함께 배우는 집중 강의입니다.",
    instructor: "황성은 목사",
    level: "입문 - 초급",
    lastUpdated: "2026.02.01",
    heroVimeoId: "76979871",
    match: { type: "prefix", value: "포스트인카운터" },
  },
];

export const resources = ["수업자료", "Q&A", "과제 피드백"];

export const tabs = ["커리큘럼", "강의소개", "수강후기", "FAQ"];
