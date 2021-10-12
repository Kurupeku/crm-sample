module Types
  class StaffType < Types::BaseObject
    key fields: 'id'
    extend_type

    field :id, ID, null: false, external: true

    field :comments, [CommentType], null: false
    def comments
      Comment.where staff_id: object[:id]
    end

    field :progresses, [ProgressType], null: false
    def progresses
      Progress.where staff_id: object[:id]
    end
  end
end
