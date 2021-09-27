module Types
  class UsersListType < Types::BaseObject
    field :users, [UserType], null: false
    field :page_info, PageInfoType, null: false
  end
end
