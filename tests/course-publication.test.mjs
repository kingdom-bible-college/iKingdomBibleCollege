import assert from "node:assert/strict";
import test from "node:test";
import { canViewCourse } from "../src/lib/courseAccess.ts";
import { createCourseSchema, updateCourseStatusSchema } from "../src/lib/validations/adminCourses.ts";

test("approved members can view published courses, but cannot view drafts or unknown statuses", () => {
  const member = { role: "member", status: "approved" };
  assert.equal(canViewCourse({ status: "active" }, member), true);
  for (const status of ["draft", "archived", "", "ACTIVE"]) {
    assert.equal(canViewCourse({ status }, member), false);
  }
});

test("only approved administrators can preview an unpublished course", () => {
  assert.equal(canViewCourse({ status: "draft" }, { role: "admin", status: "approved" }), true);
  for (const user of [null, { role: "admin", status: "pending" }, { role: "member", status: "pending" }]) {
    assert.equal(canViewCourse({ status: "draft" }, user), false);
    assert.equal(canViewCourse({ status: "active" }, user), false);
  }
});

test("course creation defaults to unpublished and requires an explicit active status to publish", () => {
  const input = { title: "영적 권위", selectedVideoIds: ["1225579019"] };
  assert.equal(createCourseSchema.parse(input).status, "draft");
  assert.equal(createCourseSchema.parse({ ...input, status: "active" }).status, "active");
  assert.equal(createCourseSchema.safeParse({ ...input, status: "public" }).success, false);
  assert.equal(createCourseSchema.safeParse({ ...input, selectedVideoIds: ["not-a-video"] }).success, false);
});

test("publication updates reject missing or invalid status and invalid course IDs", () => {
  for (const input of [{ courseId: 1 }, { courseId: 1, status: "public" }, { courseId: 0, status: "active" }]) {
    assert.equal(updateCourseStatusSchema.safeParse(input).success, false);
  }
  assert.deepEqual(updateCourseStatusSchema.parse({ courseId: "1", status: "draft" }), { courseId: 1, status: "draft" });
});
