module Types
  class CommentType < Types::BaseObject
    key fields: 'id'

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

    field :user, UserType, null: true
    def user
      { __typename: UserType, id: object.user_id }
    end

    field :staff, StaffType, null: true
    def staff
      { __typename: StaffType, id: object.user_id }
    end

    def self.resolve_reference(reference, _context)
      Comment.find reference[:id]
    end
  end
end
