package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"staff_api/entity"
	"staff_api/graph/generated"
	"staff_api/graph/model"
	"staff_api/graph/validator"

	"github.com/vektah/gqlparser/v2/gqlerror"
	"golang.org/x/crypto/bcrypt"
)

func (r *mutationResolver) CreateStaff(ctx context.Context, input *model.NewStaffInput) (*model.Staff, error) {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	staff := entity.Staff{
		Name:           input.Name,
		Email:          input.Email,
		PasswordDigest: hashed,
	}

	if validator.IsInvalidEmail(input.Email) {
		return nil, gqlerror.Errorf("Emailの形式が正しくありません")
	}

	if count := r.DB.Where("email = ?", input.Email).Find(&entity.Staff{}).RowsAffected; count > 0 {
		return nil, gqlerror.Errorf("すでに同じEmailが登録されています")
	}

	if err := r.DB.Create(&staff).Error; err != nil {
		return nil, gqlerror.Errorf("レコードの作成に失敗しました")
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) UpdateStaff(ctx context.Context, input *model.StaffInput) (*model.Staff, error) {
	var staff entity.Staff
	if count := r.DB.First(&staff, input.ID).RowsAffected; count == 0 {
		return nil, gqlerror.Errorf("対象のレコードは存在しません")
	}

	params := map[string]interface{}{}

	if input.Name != nil {
		params["name"] = *input.Name
	}

	if input.Email != nil {
		if validator.IsInvalidEmail(*input.Email) {
			return nil, gqlerror.Errorf("Emailの形式が正しくありません")
		}

		params["email"] = *input.Email
	}

	if err := r.DB.Model(&staff).Updates(params).Error; err != nil {
		return nil, gqlerror.Errorf("レコードの更新に失敗しました")
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) ChangeStaffPassword(ctx context.Context, input *model.StaffChangePasswordInput) (*model.Staff, error) {
	var staff entity.Staff
	if count := r.DB.First(&staff, input.ID).RowsAffected; count == 0 {
		return nil, gqlerror.Errorf("対象のレコードは存在しません")
	}

	if bcrypt.CompareHashAndPassword(staff.PasswordDigest, []byte(input.Password)) != nil {
		return nil, gqlerror.Errorf("現在のパスワードが正しくありません")
	}

	newHash, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), 10)

	if err := r.DB.Model(&staff).Update("password_digest", newHash).Error; err != nil {
		return nil, gqlerror.Errorf("レコードの更新に失敗しました")
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) DeleteStaff(ctx context.Context, input *model.StaffIDInput) (*model.Staff, error) {
	var staff entity.Staff
	if count := r.DB.First(&staff, input.ID).RowsAffected; count == 0 {
		return nil, gqlerror.Errorf("対象のレコードは存在しません")
	}

	if err := r.DB.Delete(&staff, input.ID).Error; err != nil {
		return nil, gqlerror.Errorf("レコードの削除に失敗しました")
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) UploadStaffIcon(ctx context.Context, input *model.StaffIconInput) (*model.Staff, error) {
	var staff entity.Staff
	if count := r.DB.First(&staff, input.ID).RowsAffected; count == 0 {
		return nil, gqlerror.Errorf("対象のレコードは存在しません")
	}

	if validator.IsInvalidIcon(input.Icon) {
		return nil, gqlerror.Errorf("有効な画像ではありません")
	}

	if err := r.DB.Model(&staff).Update("icon", input.Icon).Error; err != nil {
		return nil, gqlerror.Errorf("レコードの更新に失敗しました")
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) DeleteStaffIcon(ctx context.Context, input *model.StaffIDInput) (*model.Staff, error) {
	var staff entity.Staff
	if count := r.DB.First(&staff, input.ID).RowsAffected; count == 0 {
		return nil, gqlerror.Errorf("対象のレコードは存在しません")
	}

	if err := r.DB.Model(&staff).Update("icon", nil).Error; err != nil {
		return nil, gqlerror.Errorf("レコードの更新に失敗しました")
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *queryResolver) Staffs(ctx context.Context) ([]*model.Staff, error) {
	var staffs []entity.Staff
	if err := r.DB.Order("created_at").Find(&staffs).Error; err != nil {
		return nil, gqlerror.Errorf("情報を取得できませんでした")
	}

	var result []*model.Staff
	for _, staff := range staffs {
		result = append(result, model.StaffFromEntity(&staff))
	}

	return result, nil
}

func (r *queryResolver) StaffList(ctx context.Context, page *int, per *int) (*model.StaffList, error) {
	// panic(fmt.Errorf("not implemented"))
	var lm, pg int
	if per == nil {
		lm = 25
	} else {
		lm = *per
	}

	if page == nil {
		pg = 1
	} else {
		pg = *page
	}

	offset := lm * (pg - 1)

	var staffAll []entity.Staff
	if err := r.DB.Find(&staffAll).Error; err != nil {
		return nil, gqlerror.Errorf("情報を取得できませんでした")
	}

	var staffs []entity.Staff
	if err := r.DB.Limit(lm).Offset(offset).Find(&staffs).Error; err != nil {
		return nil, gqlerror.Errorf("情報を取得できませんでした")
	}

	var result []*model.Staff
	for _, staff := range staffs {
		result = append(result, model.StaffFromEntity(&staff))
	}

	rc := len(staffAll)
	pa := rc / lm
	if pb := rc % lm; pb > 0 {
		pa = pa + 1
	}

	pageInfo := &model.StaffPageInfo{
		CurrentPage: pg,
		RecordCount: rc,
		PageCount:   pa,
		Limit:       lm,
	}

	data := &model.StaffList{
		PageInfo: pageInfo,
		Staffs:   result,
	}

	return data, nil
}

func (r *queryResolver) Staff(ctx context.Context, id string) (*model.Staff, error) {
	var staff entity.Staff
	if count := r.DB.First(&staff, id).RowsAffected; count == 0 {
		return nil, gqlerror.Errorf("対象のレコードは存在しません")
	}

	return model.StaffFromEntity(&staff), nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
