module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

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
