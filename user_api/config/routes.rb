Rails.application.routes.draw do
  get '/health_check', to: 'health_check#index'
  post '/graphql', to: 'graphql#execute'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount GraphiQL::Rails::Engine, at: '/', graphql_path: '/graphql' if Rails.env.development?
end
