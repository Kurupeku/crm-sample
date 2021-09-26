module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :users, [UserType], null: false
    def users
      User.all
    end

    field :user, UserType, null: true do
      argument :id, Int, required: true
    end
    def user(id:)
      User.find id
    end
  end
end
