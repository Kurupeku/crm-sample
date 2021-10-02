module Types
  class MutationType < Types::BaseObject
    field :change_progress_staff, mutation: Mutations::ChangeProgressStaff
    field :change_progress_rank, mutation: Mutations::ChangeProgressRank
    field :change_progress_state, mutation: Mutations::ChangeProgressState
    field :delete_menu, mutation: Mutations::DeleteMenu
    field :update_menu, mutation: Mutations::UpdateMenu
    field :create_menu, mutation: Mutations::CreateMenu

    field :delete_comment, mutation: Mutations::DeleteComment
    field :update_comment, mutation: Mutations::UpdateComment
    field :create_comment, mutation: Mutations::CreateComment

    field :delete_inquiry, mutation: Mutations::DeleteInquiry
    field :update_inquiry, mutation: Mutations::UpdateInquiry
    field :create_inquiry, mutation: Mutations::CreateInquiry
  end
end
