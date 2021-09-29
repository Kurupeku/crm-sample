Rails.application.routes.draw do
  post '/inquiries' => 'inquiries#create', constraints: ->(req) { req.format == :json }
  post '/graphql', to: 'graphql#execute'
  mount GraphiQL::Rails::Engine, at: '/', graphql_path: '/graphql' if Rails.env.development?
end
