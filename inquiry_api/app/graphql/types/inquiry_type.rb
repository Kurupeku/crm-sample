module Types
  class InquiryType < Types::BaseObject
    key fields: 'id'

    field :id, ID, null: false
    field :user_id, Integer, null: true
    field :company_name, String, null: true
    field :name, String, null: false
    field :email, String, null: false
    field :tel, String, null: false
    field :number_of_users, Integer, null: false
    field :introductory_term, String, null: false
    field :detail, String, null: true

    field :menus, [MenuType], null: false
    def menus
      object.menus
    end

    field :comments, [CommentType], null: false
    def comments
      object.comments
    end

    field :progress, ProgressType, null: false
    def progress
      object.progress
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

    def self.resolve_reference(reference, _context)
      Inquiry.find reference[:id]
    end
  end
end
