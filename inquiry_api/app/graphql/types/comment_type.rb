module Types
  class CommentType < Types::BaseObject
    field :id, ID, null: false
    field :inquiry_id, Integer, null: false
    field :user_id, Integer, null: false
    field :content, String, null: false

    field :inquiry, InquiryType, null: false
    def inquiry
      object.inquiry
    end

    field :created_at, Int, null: false
    def created_at
      object.created_at.to_i
    end

    field :updated_at, Int, null: false
    def updated_at
      object.updated_at.to_i
    end
  end
end
