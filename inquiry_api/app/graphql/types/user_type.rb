module Types
  class UserType < Types::BaseObject
    key fields: 'id'
    extend_type

    field :id, ID, null: false, external: true

    field :inquiries, [InquiryType], null: false
    def inquiries
      Inquiry.where user_id: object[:id]
    end

    field :comments, [CommentType], null: false
    def comments
      Comment.where user_id: object[:id]
    end
  end
end
