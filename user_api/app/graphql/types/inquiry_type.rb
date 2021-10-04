module Types
  class InquiryType < Types::BaseObject
    key fields: 'id'
    extend_type

    field :id, ID, null: false, external: true

    field :user, UserType, null: true
    def user
      User.find object[:user_id]
    end
  end
end
