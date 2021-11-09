module Mutations
  class CreateComment < BaseMutation
    argument :inquiry_id, Integer, required: true
    argument :staff_id, Integer, required: true
    argument :content, String, required: true

    type Types::CommentType

    def resolve(**args)
      Comment.create! args
    end
  end
end
