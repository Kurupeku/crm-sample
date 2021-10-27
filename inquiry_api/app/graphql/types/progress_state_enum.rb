module Types
  class ProgressStateEnum < Types::BaseEnum
    value 'waiting'
    value 'waiting_recontact'
    value 'contacting'
    value 'estimating'
    value 'archived'
    value 'ordered'
  end
end
