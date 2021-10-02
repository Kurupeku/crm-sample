module Types
  class QueryType < Types::BaseObject
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :comments, [CommentType], null: false
    def comments
      Comment.all.order created_at: :desc
    end

    field :comments_list, CommentsListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
    end
    def comments_list(page: 1, per: 25)
      Comment.all.order(created_at: :desc).page(page).per(per)
    end

    field :comment, CommentType, null: true do
      argument :id, ID, required: true
    end
    def comment(id:)
      Comment.find id
    end

    field :inquiries, [InquiryType], null: false
    def inquiries
      Inquiry.all.order created_at: :desc
    end

    field :inquiries_list, InquiriesListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
    end
    def inquiries_list(page: 1, per: 25)
      Inquiry.all.order(created_at: :desc).page(page).per(per)
    end

    field :comment, InquiryType, null: true do
      argument :id, ID, required: true
    end
    def inquiry(id:)
      Inquiry.find id
    end

    field :menus, [MenuType], null: false
    def menus
      Menu.all.order created_at: :desc
    end

    field :menus_list, MenusListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
    end
    def menus_list(page: 1, per: 25)
      Menu.all.order(created_at: :desc).page(page).per(per)
    end

    field :menu, MenuType, null: true do
      argument :id, ID, required: true
    end
    def menu(id:)
      Menu.find id
    end

    field :progresses, [ProgressType], null: false
    def progresses
      Progress.all.order created_at: :desc
    end

    field :progresses_list, ProgressesListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
    end
    def progresses_list(page: 1, per: 25)
      Progress.all.order(created_at: :desc).page(page).per(per)
    end

    field :progress, ProgressType, null: true do
      argument :id, ID, required: true
    end
    def progress(id:)
      Progress.find id
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
