module Mutations
  class UpdateComment < BaseMutation
    argument :id, ID, required: true
    argument :content, String, required: true

    type Types::CommentType

    def resolve(id:, content:)
      comment = Comment.find(id)
      comment.update!(content: content) && comment
    end
  end
end
