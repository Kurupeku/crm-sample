module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :users, [UserType], null: false do
      argument :fields_cont, String, required: false
      argument :order, String, required: false
    end
    def users(fields_cont: nil, order: 'created_at desc')
      User.then do |r|
        fields_cont.present? ? r.fields_cont(fields_cont) : r.all
      end.order(order.underscore)
    end

    field :users_list, UsersListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
      argument :fields_cont, String, required: false
      argument :order, String, required: false
    end
    def users_list(page: 1, per: 25, fields_cont: nil, order: 'created_at desc')
      result = User.then do |r|
        fields_cont.present? ? r.fields_cont(fields_cont) : r.all
      end.order(order.underscore).page(page).per(per)
      parse_connection_payload result, :users
    end

    field :user, UserType, null: true do
      argument :id, Int, required: true
    end
    def user(id:)
      User.find id
    end

    private

    def parse_connection_payload(result, result_key)
      {
        "#{result_key}": result,
        page_info: {
          current_page: result.current_page,
          records_count: result.total_count,
          pages_count: result.total_pages,
          limit: result.limit_value
        }
      }
    end
  end
end
