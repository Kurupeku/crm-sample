package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"staff_api/entity"
	"staff_api/graph/generated"
	"staff_api/graph/model"

	"github.com/vektah/gqlparser/v2/gqlerror"
)

func (r *mutationResolver) CreateStaff(ctx context.Context, input *model.NewStaffInput) (*model.Staff, error) {
	var staff entity.Staff
	err := staff.Create(input.Name, input.Email, input.Password)

	if err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) UpdateStaff(ctx context.Context, input *model.StaffInput) (*model.Staff, error) {
	var staff entity.Staff
	if err := staff.Update(input.ID, input.Name, input.Email); err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) ChangeStaffPassword(ctx context.Context, input *model.StaffChangePasswordInput) (*model.Staff, error) {
	var staff entity.Staff
	if err := staff.ChangePassword(input.ID, input.Password, input.NewPassword); err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) DeleteStaff(ctx context.Context, input *model.StaffIDInput) (*model.Staff, error) {
	var staff entity.Staff
	if err := staff.Delete(input.ID); err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) UploadStaffIcon(ctx context.Context, input *model.StaffIconInput) (*model.Staff, error) {
	var staff entity.Staff
	if err := staff.UpdateIcon(input.ID, input.Icon); err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *mutationResolver) DeleteStaffIcon(ctx context.Context, input *model.StaffIDInput) (*model.Staff, error) {
	var staff entity.Staff
	if err := staff.DeleteIcon(input.ID); err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *queryResolver) Staffs(ctx context.Context) ([]*model.Staff, error) {
	staffs, err := entity.AllStaffs()
	if err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	var result []*model.Staff
	for _, staff := range staffs {
		result = append(result, model.StaffFromEntity(&staff))
	}

	return result, nil
}

func (r *queryResolver) StaffsList(ctx context.Context, page *int, per *int) (*model.StaffsList, error) {
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

	staffs, err := entity.PaginatedStaffs(lm, offset)
	if err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	var result []*model.Staff
	for _, staff := range staffs {
		result = append(result, model.StaffFromEntity(&staff))
	}

	pi, err := entity.GetPageInfo(lm, pg)
	if err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	data := &model.StaffsList{
		Staffs: result,
		PageInfo: &model.StaffPageInfo{
			CurrentPage:  pi.CurrentPage,
			RecordsCount: pi.RecordsCount,
			PagesCount:   pi.PagesCount,
			Limit:        pi.Limit,
		},
	}

	return data, nil
}

func (r *queryResolver) Staff(ctx context.Context, id string) (*model.Staff, error) {
	var staff entity.Staff
	if err := staff.FindStaffByID(id); err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

func (r *queryResolver) StaffByEmail(ctx context.Context, email string) (*model.Staff, error) {
	var staff entity.Staff
	if err := staff.FindStaffByEmail(email); err != nil {
		return nil, gqlerror.Errorf(err.Error())
	}

	return model.StaffFromEntity(&staff), nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
