# CRM サンプルシステム

マイクロサービスアーキテクチャで構成された CRM ツールです。

インバウンドで受け付けた問い合わせを一覧で管理し、進捗や連絡日などを登録して複数人で捌くためのツールというイメージで作成しています。

フロントエンドと API が完全に分離した SPA となっており、両者とも AWS のサービスを用いて稼働させています。

サーバー間およびクライアントとの通信には

- REST
- GraphQL
- gRPC

などを使用しています。

GitHub Actions を用いての CI/CD も取り入れています。

## デモ

![demo](https://user-images.githubusercontent.com/22340645/141000816-b2b793c1-b789-4c3d-ae9f-3ca62687b702.gif)

[CRM Sample App](https://www.crm-sample-app.kurupeku.dev/login) からログインできます。

ゲストアカウントを使用してログインしてください。

なお、内部から各種情報の編集・削除などが行えますが、ゲストアカウント自体の情報を編集した際は元に戻してからログアウト頂きますよう、よろしくお願いいたします。

## 主な使用言語とフレームワーク

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

![demo](https://github.com/Kurupeku/crm-sample/blob/main/docs/assets/services.png?raw=true)

当プロジェクトのバックエンドは 3 つのサービスと 2 つの中継サーバーで構成されています。

### サービス

#### Staff API

操作するスタッフの情報を扱うサービスです。

認証用サーバーも兼任しています。

使用言語は Golang で、gqlgen というスキーマドリブンなフレームワークにて構築しています。

認証情報の問い合わせにのみ gRPC を使用して応答します。

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

また JWT の認可もこのサーバーにて行っており、認可したアクセスのみを GraphQL 用エンドポイントにつなぎます。

## インフラ構成

![demo](https://github.com/Kurupeku/crm-sample/blob/main/docs/assets/aws.png?raw=true)

バックエンドは ECR にてオーケストレーションを組んでいます。

コンテナーは Fargate 上で動いていますが、最小構成で動かすようにしているためタスク数は 1、タスク内に複数コンテナーを走らせてポート間通信でマイクロサービスを組んでいます。

DB のマイグレーションおよびデモ用データの流し込み用コンテナーも同一タスク内に定義しており、マイグレーション/データ刷新はデプロイごとに自動で行われます。

GitHub Actions でデプロイ用の Workflow を組んでいるため、main ブランチにプッシュ or プルリクエストのマージが発生した際には新しいリビジョンでタスク定義が更新されます。

フロントエンドの Next.js は Amplify で SSR モードにてホスティングしており、そこからバックエンドへ通信を行いデータを取得しています。

こちらはデフォルトで用意されている AutoDeployment を使用しており、client ディレクトリ以下の更新を検知して自動でビルド&ホスティングが行われます。

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
