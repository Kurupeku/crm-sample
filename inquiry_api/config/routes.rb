Rails.application.routes.draw do
  get '/menus' => 'menus#index', constraints: ->(req) { req.format == :json }
  post '/inquiries' => 'inquiries#create', constraints: ->(req) { req.format == :json }
  post '/graphql', to: 'graphql#execute'
  mount GraphiQL::Rails::Engine, at: '/', graphql_path: '/graphql' if Rails.env.development?
end
