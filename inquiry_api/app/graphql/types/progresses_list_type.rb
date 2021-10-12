module Types
  class ProgressesListType < Types::BaseObject
    field :progresses, ProgressType, null: false
    field :page_info, PageInfoType, null: false
  end
end
