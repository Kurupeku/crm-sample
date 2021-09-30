module Types
  class MenusListType < Types::BaseObject
    field :menus, [MenuType], null: false
    field :page_info, PageInfoType, null: false
  end
end
