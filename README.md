# CRM サンプルシステム

マイクロサービスアーキテクチャで構成された CRM ツールです。

インバウンドで受け付けた問い合わせを一覧で管理し、進捗や連絡日などを登録して複数人で捌くためのツールというイメージで作成しています。

フロントエンドは Next.js (React) を用いた SPA となっており、バックエンドはコンテキスト境界で切り分けたマイクロサービスとしてコンテナにて稼働します。

サーバー間およびクライアントとの通信には

- REST
- GraphQL
- gRPC

などを使用しています。

GitHub Actions を用いての CI/CD も取り入れています。

## デモ

![demo](https://user-images.githubusercontent.com/22340645/141000816-b2b793c1-b789-4c3d-ae9f-3ca62687b702.gif)

<!-- [CRM Sample App](https://www.crm-sample-app.kurupeku.dev/login) からログインできます。 -->

### ローカル上でデモを起動する

ローカル上で `docker-compose` or `kind` をインストールして起動出来ます。

どちらも起動まで少し時間がかかります

#### Docker Compose での起動方法

環境変数設定のため、プロジェクトルートに以下の内容で `.env` ファイルを作成してください

```txt
GO_ENV=development
NODE_ENV=development
NEXT_PUBLIC_API_HOST=http://localhost:2000
FEDERATION_HOST=federation:3000
AUTH_HOST=auth_api:50051
STAFF_HOST=staff_api:3001
USER_HOST=user_api:3002
INQUIRY_HOST=inquiry_api:3003
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
```

`.env` 作成後、以下のコマンドを順に入力すればサービスが稼働します

```bash
docker compose build
docker compose up -d
```

起動後 [http://localhost:8080](http://localhost:8080) にアクセスすればアプリケーションが表示されます

#### Kubernetes (kind) での起動方法

[kind](https://kind.sigs.k8s.io/) を前提に構築しています。
インストールされていない場合はインストールしてください

起動用のコマンドを [Makefile](./Makefile) に用意しているので、以下を入力してクラスターの起動とリソースの Apply を行ってください

```bash
make create-kind-cluster
make apply-local
```

リソースを削除する場合は

```bash
make delete-local
```

クラスターを削除する場合は

```bash
make delete-kind-cluster
```

を入力してください

起動後 [http://localhost(:80)](http://localhost:80) にアクセスすればアプリケーションが表示されます

### デモアプリケーションのログイン方法

ゲストアカウントを使用してログインしてください。

- Email: `guest@example.com`
- Password: `password`

## 主な使用言語 / FW / ライブラリ

- Ruby
  - Ruby on Rails
  - graphql-rails
- Golang
  - Gin
  - gqlgen
  - gorm
- JavaScript (TypeScript)
  - React (Next.js)
  - Node.js
  - Apollo Client
  - Apollo Server & Federation
  - GraphQL Code Generator

## サービス構成

![demo](docs/assets/services.png?raw=true)

当プロジェクトのバックエンドは 3 つのサービスと 2 つの中継サーバーで構成されています。

### サービス

#### Auth API

JWT の認証のみを行うサービスです。

コンテキスト境界上は後述の Staff API と同等ですが、レイテンシを抑えるために gRPC でリクエストを受け付けている関係上、サービスとしては独立させています

実装は Golang で、DDD によるレイヤードアーキテクチャを取り入れています。

#### Staff API

アプリケーションの利用者であるスタッフの情報を扱うサービスです。

使用言語は Golang で、gqlgen というスキーマドリブンなフレームワークにて構築しています。

#### User API

ユーザー情報を取り扱うサービスです。

使用言語は Ruby で、Ruby on Rails にて構築しています。

GraphQL 配信のため graphql-rails という Gem も併用しています。

#### Inquiry API

顧客からの問い合わせとそれに関連するデータを取り扱うサービスです。

構成は User API と同様です。

### 中継サーバー

#### Apollo Federation Server

複数の GraphQL サーバーをまとめて単一の GraphQL エンドポイントを提供するために使用している Node.js サーバーです。

### Gateway Reverse Proxy Server

各サービスに対するリクエストを振り分けています。

また JWT の検証もこのサーバーにて行っており、ログインが確認できたアクセスのみを GraphQL 用エンドポイントにつなぎます。

<!-- ## インフラ構成

![demo](https://github.com/Kurupeku/crm-sample/blob/main/docs/assets/aws.png?raw=true)

バックエンドは ECR にてオーケストレーションを組んでいます。

コンテナーは Fargate 上で動いていますが、最小構成で動かすようにしているためタスク数は 1、タスク内に複数コンテナーを走らせてポート間通信でマイクロサービスを組んでいます。

DB のマイグレーションおよびデモ用データの流し込み用コンテナーも同一タスク内に定義しており、マイグレーション/データ刷新はデプロイごとに自動で行われます。

GitHub Actions でデプロイ用の Workflow を組んでいるため、main ブランチにプッシュ or プルリクエストのマージが発生した際には新しいリビジョンでタスク定義が更新されます。

フロントエンドの Next.js は Amplify で SSR モードにてホスティングしており、そこからバックエンドへ通信を行いデータを取得しています。

こちらはデフォルトで用意されている AutoDeployment を使用しており、client ディレクトリ以下の更新を検知して自動でビルド&ホスティングが行われます。 -->

## 機能一覧

- JWT トークン認証・認可
  - ログイン
  - ログアウト
  - 有効期限による強制ログアウト
  - 有効期限の自動延長
- 各リソースに対する CRUD アクション
  - ページネーション
  - キーワードによる曖昧検索
  - ソート
