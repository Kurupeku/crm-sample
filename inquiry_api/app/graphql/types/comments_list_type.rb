module Types
  class CommentsListType < Types::BaseObject
    field :comments, [CommentType], null: false
    field :page_info, PageInfoType, null: false
  end
end
