# KBC Admin 관리자 사이트 구조

## 개요

관리자 전용 대시보드로, 회원 승인/관리와 강의 관리 기능을 제공합니다.
`requireAdmin()` 미들웨어를 통해 admin 역할이 있는 사용자만 접근 가능합니다.

---

## 라우트 구조

```
/admin                        ← 대시보드 (관리 메뉴 카드)
/admin/users                  ← 회원 승인 관리
/admin/courses                ← 강의 관리 (추가/목록)
```

### 레이아웃

```
src/app/(main)/admin/
├── layout.tsx                 # Admin 전용 레이아웃 (사이드바 포함)
├── sidebar.tsx                # 사이드바 네비게이션 (Client Component)
├── page.tsx                   # 대시보드 랜딩
├── users/
│   └── page.tsx               # 회원 승인 관리
└── courses/
    ├── page.tsx               # 강의 관리 (탭: 추가/목록)
    ├── adminCoursesClient.tsx # 강의 목록 + 드래그앤드롭 (Client Component)
    └── adminVideoPicker.tsx   # Vimeo 영상 선택기 (Client Component)
```

---

## 페이지별 기능

### 1. 대시보드 (`/admin`)

관리 기능으로 이동하는 카드 형태의 네비게이션 제공:

| 메뉴 | 상태 |
|------|------|
| 회원 승인 | 활성 |
| 강의 관리 | 활성 |
| 공지 관리 | 비활성 (예정) |

### 2. 회원 승인 (`/admin/users`)

Server Component + Server Actions 기반.

**승인 대기 섹션:**
- `status="pending"` 회원 목록 표시
- 승인 버튼 → `approveUser()` (status → approved)
- 관리자 지정 버튼 → `makeAdmin()` (role → admin)

**승인 완료 섹션:**
- `status="approved"` 회원 목록 표시
- 역할 배지 표시 (member/admin)
- 승인 취소 버튼 → `revokeUser()` (status → pending)

### 3. 강의 관리 (`/admin/courses`)

두 개의 탭으로 구성:

**"강의 추가" 탭:**
- 강의 정보 입력 폼:
  - 강의명 (필수), 슬러그 (자동 생성), 강사, 난이도, 업데이트일, 히어로 Vimeo ID, 강의 소개
- Vimeo 프로젝트 폴더 선택 드롭다운
- `AdminVideoPicker`로 영상 다중 선택
- `createCourseAction()` Server Action으로 강의 생성

**"추가된 강의" 탭:**
- `AdminCoursesClient` (Client Component)
- 강의 목록 표시 (제목, 소개, 매칭 타입, 강의 수, 상태)
- 드래그앤드롭으로 강의 순서 변경
- 강의 내 영상 순서 드래그앤드롭 변경
- 강의 삭제 기능
- 저장 상태 및 타임스탬프 표시

---

## Admin API 엔드포인트

```
POST /api/admin/courses/reorder        ← 강의 순서 변경
POST /api/admin/courses/videos/reorder ← 강의 내 영상 순서 변경
POST /api/admin/courses/delete         ← 강의 삭제
```

| 엔드포인트 | Body | 설명 |
|-----------|------|------|
| `/api/admin/courses/reorder` | `{ orderedIds: string[] }` | 강의 sortOrder 업데이트 |
| `/api/admin/courses/videos/reorder` | `{ courseId, orderedVideoIds }` | 강의 영상 순서 교체 |
| `/api/admin/courses/delete` | `{ id: string }` | 강의 삭제 (영상 연결 cascade) |

---

## 관련 DAL 쿼리

| 파일 | 함수 | 설명 |
|------|------|------|
| `queries/users.ts` | `getAllUsers()` | 전체 회원 조회 |
| `queries/users.ts` | `updateUser(id, data)` | 회원 상태/역할 변경 |
| `queries/courses.ts` | `getCourses()` | 전체 강의 조회 (sortOrder순) |
| `queries/courses.ts` | `createCourse(data)` | 강의 생성 |
| `queries/courses.ts` | `deleteCourse(id)` | 강의 삭제 |
| `queries/courseVideoOrders.ts` | `replaceCourseVideoOrders()` | 강의 영상 순서 교체 |

---

## 인증/권한

- `requireAdmin()` — 모든 admin 페이지에서 호출
- 인증되지 않은 사용자 → `/login` 리다이렉트
- admin 역할이 아닌 사용자 → `/courses` 리다이렉트

---

## DB 테이블 (Admin 관련)

```
users             ← 회원 관리 (status, role 필드)
courses           ← 강의 메타데이터
course_video_orders ← 강의-영상 연결 및 순서
sessions          ← 세션 관리 (인증)
```
