module Mutations
  class DeleteComment < BaseMutation
    argument :id, ID, required: true
    type Types::CommentType

    def resolve(id:)
      comment = Comment.find(id)
      comment.destroy! && comment
    end
  end
end
