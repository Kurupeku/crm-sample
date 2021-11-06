module Types
  class QueryType < Types::BaseObject
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :comments, [CommentType], null: false do
      argument :order, String, required: false
    end
    def comments(order: 'created_at desc')
      Comment.all.order order.underscore
    end

    field :comments_list, CommentsListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
      argument :order, String, required: false
    end
    def comments_list(page: 1, per: 25, order: 'created_at desc')
      result = Comment.all.order(order.underscore).page(page).per(per)
      parse_connection_payload result, :comments
    end

    field :comment, CommentType, null: true do
      argument :id, ID, required: true
    end
    def comment(id:)
      Comment.find id
    end

    field :inquiries, [InquiryType], null: false do
      argument :order, String, required: false
      argument :fields_cont, String, required: false
      argument :staff_id, Int, required: false
    end
    def inquiries(fields_cont: nil, staff_id: nil, order: 'created_at desc')
      Inquiry.all.then do |r|
        fields_cont.present? ? r.fields_cont(fields_cont) : r
      end.then do |r|
        staff_id.present? ? r.includes(:progress).where(progress: { staff_id: staff_id }) : r
      end.order order.underscore
    end

    field :inquiries_list, InquiriesListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
      argument :order, String, required: false
      argument :fields_cont, String, required: false
      argument :staff_id, Int, required: false
      argument :state, ProgressStateEnum, required: false
    end
    def inquiries_list(page: 1, per: 25, fields_cont: nil, staff_id: nil, order: 'created_at desc', state: nil)
      result = Inquiry.joins(:progress)
                      .fields_cont(fields_cont)
                      .state_eq(state)
                      .staff_eq(staff_id)
                      .order(order.underscore)
                      .page(page)
                      .per(per)
      parse_connection_payload result, :inquiries
    end

    field :inquiry, InquiryType, null: true do
      argument :id, ID, required: true
    end
    def inquiry(id:)
      Inquiry.find id
    end

    field :menus, [MenuType], null: false do
      argument :order, String, required: false
    end
    def menus(order: 'created_at desc')
      Menu.all.order order.underscore
    end

    field :menus_list, MenusListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
      argument :order, String, required: false
    end
    def menus_list(page: 1, per: 25, order: 'created_at desc')
      result = Menu.all.order(order.underscore).page(page).per(per)
      parse_connection_payload result, :menus
    end

    field :menu, MenuType, null: true do
      argument :id, ID, required: true
    end
    def menu(id:)
      Menu.find id
    end

    field :progresses, [ProgressType], null: false do
      argument :order, String, required: false
      argument :rank, ProgressRankEnum, required: false
      argument :state, ProgressStateEnum, required: false
      argument :staff_id, Int, required: false
    end
    def progresses(rank: nil, state: nil, staff_id: nil, order: 'created_at desc')
      Progress.all.then do |r|
        rank.present? && r.respond_to?(rank) ? r.send(rank) : r
      end.then do |r|
        state.present? && r.respond_to?(state) ? r.send(state) : r
      end.then do |r|
        staff_id.present? ? r.where(staff_id: staff_id) : r
      end.order order.underscore
    end

    field :progresses_list, ProgressesListType, null: false do
      argument :page, Int, required: false
      argument :per, Int, required: false
      argument :order, String, required: false
      argument :rank, ProgressRankEnum, required: false
      argument :state, ProgressStateEnum, required: false
      argument :staff_id, Int, required: false
    end
    def progresses_list(page: 1, per: 25, rank: nil, state: nil, staff_id: nil, order: 'created_at desc')
      result = Progress.all.then do |r|
        rank.present? && r.respond_to?(rank) ? r.send(rank) : r
      end.then do |r|
        state.present? && r.respond_to?(state) ? r.send(state) : r
      end.then do |r|
        staff_id.present? ? r.where(staff_id: staff_id) : r
      end.order(order.underscore).page(page).per(per)
      parse_connection_payload result, :progresses
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
