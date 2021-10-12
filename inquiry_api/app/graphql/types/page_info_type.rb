module Types
  class PageInfoType < Types::BaseObject
    field :current_page, Int, null: false
    field :records_count, Int, null: false
    field :pages_count, Int, null: false
    field :limit, Int, null: false
  end
end
