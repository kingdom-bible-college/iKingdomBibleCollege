# 🐘 Next.js + Drizzle + PostgreSQL Starter

본 프로젝트는 **Next.js(App Router)**를 기반으로 Drizzle ORM과 Docker PostgreSQL을 사용하는 타입 안전(Type-safe)한 풀스택 애플리케이션입니다.  
Server-First 원칙과 DAL(Data Access Layer) 패턴을 준수하여 개발되었습니다.

---

## 🛠 Tech Stack

| 분류 | 기술 | 비고 |
|------|------|------|
| **Framework** | Next.js 14+ (App Router) | TypeScript 기반 서버 사이드 렌더링 |
| **Runtime** | Node.js | 고성능 서버 런타임 |
| **Database** | PostgreSQL (v15) | Docker 컨테이너 기반 (Port: 5432) |
| **ORM** | Drizzle ORM | 타입 안전한 SQL 쿼리 빌더 |
| **Driver** | postgres.js / pg | 가볍고 빠른 DB 연결 드라이버 |
| **Tools** | Drizzle Kit | 마이그레이션 및 DB 스키마 관리 |
| **Validation** | Zod | 런타임 타입 검증 및 스키마 연동 |

---

## 🏗 Architecture & Patterns

우리 프로젝트는 코드의 유지보수성과 보안을 위해 다음의 **3가지 핵심 패턴**을 따릅니다.

### 1. Server-First 패턴 (Architecture)

- **원칙**: 모든 데이터 비즈니스 로직은 서버에서 시작합니다.
- **적용**: `app/**/page.tsx`를 기본 서버 컴포넌트로 활용하고, DB 접근 코드가 클라이언트로 유출되지 않도록 `server-only` 패키지를 사용합니다.

### 2. DAL (Data Access Layer) 패턴 (Organization)

- **원칙**: DB 쿼리 로직을 UI 컴포넌트와 분리합니다.
- **적용**: `src/db/queries/*` 폴더에 각 도메인별(예: users, posts) 쿼리 함수를 모아두고 필요할 때만 호출하여 재사용성을 극대화합니다.

### 3. Compound Component 패턴 (UI Design)

- **원칙**: 복잡한 UI는 상태를 공유하는 작은 컴포넌트들의 조합으로 설계합니다.
- **적용**: Select, Modal, Table 등 재사용성이 높은 UI는 부모-자식 구조로 설계하여 유연한 레이아웃을 제공합니다.

---

## 🚀 Getting Started

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 정보를 입력합니다.

```bash
# PostgreSQL Connection URL
DATABASE_URL=postgres://admin:password123@localhost:5432/my_database
```

### 2. Docker DB 실행

Docker를 사용하여 로컬 PostgreSQL 환경을 띄웁니다.

```bash
docker-compose up -d
```

### 3. 의존성 설치 및 DB 스키마 푸시

```bash
# 패키지 설치
pnpm install

# Drizzle 스키마를 실제 DB에 반영
npx drizzle-kit push
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

---

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router (Pages, API Routes)
├── components/       # UI Components (Compound Pattern 적용)
├── db/               
│   ├── index.ts      # Drizzle Client 설정
│   ├── schema.ts     # 테이블 정의 (Single or Multiple files)
│   └── queries/      # DAL: 재사용 가능한 DB 쿼리 함수들
├── lib/              # 공통 유틸리티 (hooks, utils 등)
└── drizzle/          # drizzle-kit이 생성한 마이그레이션 파일
```

---

## 📑 Database Management Commands

| 명령어 | 설명 |
|--------|------|
| `npx drizzle-kit generate` | 스키마 변경 감지 및 마이그레이션 파일 생성 |
| `npx drizzle-kit push` | DB에 즉시 반영 (개발용) |
| `npx drizzle-kit studio` | DB GUI 뷰어 실행 |

---

## ⚠️ Development Rules

| 규칙 | 설명 |
|------|------|
| **`"use client"` 최소화** | 인터랙션이 필요한 말단 컴포넌트에만 선언합니다. |
| **Type Safety** | 모든 DB 결과값은 Drizzle이 생성한 타입을 활용하여 별도의 타입 단언을 피합니다. |
| **Query Location** | `page.tsx`에서 직접 `db.select()`를 호출하지 않고, 반드시 `queries` 폴더의 함수를 거칩니다. |

---

## 📝 License

MIT License