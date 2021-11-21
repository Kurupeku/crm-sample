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
  let(:model) { Progress }

  describe '# scopes' do
    let(:target) { create :progress, rank: 'c', state: 'waiting_recontact', staff_id: 2 }
    before do
      create_list :progress, 5, rank: 'd', state: 'waiting', staff_id: 1
    end

    context 'rank_eq' do
      it 'rankと一致するレコードを返す' do
        target
        is_asserted_by { model.rank_eq('c').size == 1 }
      end
    end

    context 'state_eq' do
      it 'stateと一致するレコードを返す' do
        target
        is_asserted_by { model.state_eq('waiting_recontact').size == 1 }
      end
    end

    context 'staff_eq' do
      it 'staff_idと一致するレコードを返す' do
        target
        is_asserted_by { model.staff_eq(2).size == 1 }
      end
    end
  end

  describe '# aasm_status' do
    let(:progress) { create :progress, state: :waiting }
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

  describe '# selectable_events' do
    context 'status == waitingの場合' do
      let(:events) do
        %i[contact recontact contacted archive].map do |event|
          { label: I18n.t(event, scope: %i[activerecord attributes progress event]), event: event }
        end
      end
      let(:progress) { create :progress, state: :waiting }
      it 'order以外のeventが配列で返される' do
        is_asserted_by { progress.selectable_events == events }
      end
    end

    context 'status == estimatingの場合' do
      let(:events) do
        %i[archive order].map do |event|
          { label: I18n.t(event, scope: %i[activerecord attributes progress event]), event: event }
        end
      end
      let(:progress) { create :progress, state: 'estimating' }
      it 'archiveとorderのみが配列で返される' do
        is_asserted_by { progress.selectable_events == events }
      end
    end
  end

  describe '# state_i18n' do
    it 'stateが翻訳された値として出力される' do
      progress = create :progress, state: 'waiting'
      is_asserted_by { progress.state_i18n == '未着手' }
    end
  end

  describe '# assign_recontacted_on!' do
    let(:progress) { create :progress }
    let(:date_string) { Date.today.strftime '%F' }
    context 'state: waiting_recontactの場合' do
      it '正常に値が更新される' do
        progress.update! state: :waiting_recontact
        progress.assign_recontacted_on!(date_string)
      end
    end

    context 'state: waiting_recontact以外の場合' do
      it 'ActiveRecord::RecordInvalidをraiseする' do
        progress.update! state: :waiting
        expect { progress.assign_recontacted_on!(date_string) }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end
end
