# == Schema Information
#
# Table name: progresses
#
#  id             :bigint           not null, primary key
#  contacted_at   :datetime
#  rank           :integer          default("d"), not null
#  recontacted_on :date
#  state          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  inquiry_id     :bigint           not null
#  staff_id       :integer
#
# Indexes
#
#  index_progresses_on_inquiry_id  (inquiry_id)
#
# Foreign Keys
#
#  fk_rails_...  (inquiry_id => inquiries.id)
#
require 'rails_helper'

RSpec.describe Progress, type: :model do
  describe '# aasm_status' do
    let(:progress) { create :progress }
    let(:error_message) do
      I18n.t :status_denied,
             scope: %i[activerecord errors messages]
    end

    context 'status == waitingの場合' do
      it 'contactingに変更できる' do
        is_asserted_by { progress.contact! }
      end

      it 'waiting_recontactに変更できる' do
        is_asserted_by { progress.recontact! }
      end

      it 'estimatingに変更できる' do
        is_asserted_by { progress.contacted! }
      end

      it 'archivedに変更できる' do
        is_asserted_by { progress.archive! }
      end

      it 'orderedに変更できない' do
        is_asserted_by { !progress.order! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end
    end

    context 'status == waiting_recontactの場合' do
      before do
        progress.update state: 'waiting_recontact'
      end

      it 'contactingに変更できる' do
        is_asserted_by { progress.contact! }
      end

      it 'waiting_recontactに変更できない' do
        is_asserted_by { !progress.recontact! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'estimatingに変更できる' do
        is_asserted_by { progress.contacted! }
      end

      it 'archivedに変更できる' do
        is_asserted_by { progress.archive! }
      end

      it 'orderedに変更できない' do
        is_asserted_by { !progress.order! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end
    end

    context 'status == contactingの場合' do
      before do
        progress.update state: 'contacting'
      end

      it 'contactingに変更できない' do
        is_asserted_by { !progress.contact! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'waiting_recontactに変更できる' do
        is_asserted_by { progress.recontact! }
      end

      it 'estimatingに変更できる' do
        is_asserted_by { progress.contacted! }
      end

      it 'archivedに変更できる' do
        is_asserted_by { progress.archive! }
      end

      it 'orderedに変更できない' do
        is_asserted_by { !progress.order! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end
    end

    context 'status == estimatingの場合' do
      before do
        progress.update state: 'estimating'
      end

      it 'contactingに変更できない' do
        is_asserted_by { !progress.contact! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'waiting_recontactに変更できない' do
        is_asserted_by { !progress.recontact! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'estimatingに変更できない' do
        is_asserted_by { !progress.contacted! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'archivedに変更できる' do
        is_asserted_by { progress.archive! }
      end

      it 'orderedに変更できる' do
        is_asserted_by { progress.order! }
      end
    end

    context 'status == archivedの場合' do
      before do
        progress.update state: 'archived'
      end

      it 'contactingに変更できない' do
        is_asserted_by { !progress.contact! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'waiting_recontactに変更できない' do
        is_asserted_by { !progress.recontact! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'estimatingに変更できない' do
        is_asserted_by { !progress.contacted! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'archivedに変更できない' do
        is_asserted_by { !progress.archive! }
        is_asserted_by { progress.errors.full_messages.first == error_message }
      end

      it 'orderedに変更できる' do
        is_asserted_by { progress.order! }
      end
    end

    context 'status == orderdの場合' do
      before do
        progress.update state: 'ordered'
      end

      it 'contactingに変更できない' do
        is_asserted_by { !progress.contact! }
      end

      it 'waiting_recontactに変更できない' do
        is_asserted_by { !progress.recontact! }
      end

      it 'estimatingに変更できない' do
        is_asserted_by { !progress.contacted! }
      end

      it 'archivedに変更できない' do
        is_asserted_by { !progress.archive! }
      end

      it 'orderedに変更できない' do
        is_asserted_by { !progress.order! }
      end
    end
  end
end
