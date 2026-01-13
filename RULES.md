# 📋 Development Rules

본 문서는 프로젝트의 일관성과 유지보수성을 위한 개발 규칙입니다.  
모든 기여자(인간 및 AI)는 이 규칙을 준수해야 합니다.

---

## 🏗 Architecture Rules

### 1. Server-First 원칙
- **모든 데이터 로직은 서버에서 시작**합니다.
- `app/**/page.tsx`는 기본적으로 Server Component입니다.
- DB 접근 코드가 클라이언트로 유출되지 않도록 `server-only` 패키지를 사용합니다.

```typescript
// ✅ 올바른 예시: server-only import
import 'server-only';
import { db } from '@/db';
```

### 2. DAL (Data Access Layer) 패턴
- **DB 쿼리 로직은 반드시 `src/db/queries/` 폴더에 작성**합니다.
- `page.tsx`에서 직접 `db.select()`를 호출하지 않습니다.
- 각 도메인별로 파일을 분리합니다 (예: `users.ts`, `posts.ts`).

```typescript
// ❌ 잘못된 예시: page.tsx에서 직접 쿼리
export default async function Page() {
  const users = await db.select().from(usersTable);
}

// ✅ 올바른 예시: DAL 함수 호출
import { getAllUsers } from '@/db/queries/users';

export default async function Page() {
  const users = await getAllUsers();
}
```

### 3. Compound Component 패턴 (UI)
- 복잡한 UI는 **상태를 공유하는 작은 컴포넌트들의 조합**으로 설계합니다.
- Select, Modal, Table 등은 부모-자식 구조로 설계합니다.

---

## 📁 Directory Structure

```
src/
├── app/              # Next.js App Router (Pages, Layouts, API Routes)
├── components/       # UI Components (Compound Pattern)
│   ├── ui/           # 기본 UI 컴포넌트 (Button, Input 등)
│   └── [feature]/    # 도메인별 컴포넌트
├── db/
│   ├── index.ts      # Drizzle Client (수정 금지)
│   ├── schema.ts     # 테이블 스키마 정의
│   └── queries/      # DAL 쿼리 함수들
├── lib/              # 공통 유틸리티
│   ├── utils.ts      # 헬퍼 함수
│   └── validations/  # Zod 스키마
└── types/            # 공통 타입 정의
```

---

## 🎯 Coding Standards

### TypeScript
- `any` 타입 사용 금지 (정말 불가피한 경우 `unknown` 사용)
- Drizzle이 생성한 타입을 활용 (`$inferSelect`, `$inferInsert`)
- 타입 단언(`as`) 최소화

```typescript
// ✅ Drizzle 자동 타입 활용
import { users } from '@/db/schema';
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;
```

### Components
- `"use client"` 선언은 **인터랙션이 필요한 말단 컴포넌트에만** 적용
- Props 타입은 컴포넌트 파일 내에서 정의
- 컴포넌트 파일명은 PascalCase (예: `UserCard.tsx`)

### Naming Conventions
| 항목 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `UserCard.tsx` |
| 유틸 함수 | camelCase | `formatDate.ts` |
| DB 쿼리 함수 | camelCase, 동사로 시작 | `getAllUsers`, `createUser` |
| 테이블명 | snake_case (복수형) | `users`, `blog_posts` |
| 환경 변수 | SCREAMING_SNAKE_CASE | `DATABASE_URL` |

---

## 🔒 Security Rules

- **민감 정보는 `.env.local`에만 저장** (절대 커밋 금지)
- API Route에서 입력값은 반드시 **Zod로 검증**
- 사용자 입력을 직접 SQL에 삽입 금지 (Drizzle ORM 사용)

---

## 🗄 Database Rules

### Schema 변경 시
1. `src/db/schema.ts` 수정
2. `npx drizzle-kit generate` 실행 (마이그레이션 파일 생성)
3. `npx drizzle-kit push` 실행 (개발 DB 반영)

### 쿼리 함수 작성 규칙
- 모든 쿼리 함수는 `'server-only'` import 필수
- 함수명은 동사로 시작 (`get`, `create`, `update`, `delete`)
- 단일 결과는 `null` 반환 가능, 목록은 빈 배열 반환

```typescript
// 단일 조회: 없으면 null
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] ?? null;
}

// 목록 조회: 없으면 빈 배열
export async function getAllUsers() {
  return db.select().from(users);
}
```

---

## ✅ Checklist (PR 전 확인)

- [ ] `"use client"`가 불필요하게 사용되지 않았는가?
- [ ] DB 쿼리가 `queries/` 폴더에 있는가?
- [ ] TypeScript 타입 에러가 없는가? (`pnpm tsc --noEmit`)
- [ ] ESLint 에러가 없는가? (`pnpm lint`)
- [ ] 환경 변수가 `.env.local`에만 있는가?
