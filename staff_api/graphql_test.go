package main

import (
	"fmt"
	"log"
	"os"
	"testing"

	"staff_api/database"
	"staff_api/entity"
	"staff_api/graph"
	"staff_api/graph/generated"

	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"

	// "github.com/99designs/gqlgen/graphql/introspection"
	"github.com/stretchr/testify/assert"
	// "github.com/stretchr/testify/require"
	"golang.org/x/crypto/bcrypt"
)

func TestGraphql(t *testing.T) {
	os.Setenv("GO_ENV", "test")
	db, err := database.Connect()
	if err != nil {
		log.Panic(err)
	}

	err = db.AutoMigrate(&entity.Staff{})
	if err != nil {
		log.Panic(err)
	}

	staffs := createStaffs(t, 30)
	fid := fmt.Sprintf("%d", staffs[0].ID)

	c := client.New(handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}})))

	t.Run("Staff: Success", func(t *testing.T) {
		var resp struct {
			Staff struct {
				ID string
			}
		}
		c.MustPost(fmt.Sprintf(`
		query {
			staff(id: %s) {
				id
			}
		}`, fid), &resp)
		assert.Equal(t, fid, resp.Staff.ID)
	})

	t.Run("Staffs: Success", func(t *testing.T) {
		var resp struct {
			Staffs []struct {
				ID string
			}
		}
		c.MustPost(`
		query {
			staffs {
				id
			}
		}`, &resp)
		assert.Equal(t, 30, len(resp.Staffs))
	})

	t.Run("StaffsList: Success", func(t *testing.T) {
		var resp struct {
			StaffsList struct {
				Staffs []struct {
					ID string
				}
				PageInfo struct {
					CurrentPage  int
					PagesCount   int
					RecordsCount int
					Limit        int
				}
			}
		}
		c.MustPost(`
		query {
			staffsList(per: 20, page: 2) {
				staffs {
					id
				}
				pageInfo {
					currentPage
					pagesCount
					recordsCount
					limit
				}
			}
		}`, &resp)
		assert.Equal(t, 10, len(resp.StaffsList.Staffs))
		assert.Equal(t, 30, resp.StaffsList.PageInfo.RecordsCount)
		assert.Equal(t, 2, resp.StaffsList.PageInfo.PagesCount)
	})

	t.Run("CreateStaff: Success", func(t *testing.T) {
		blen := getRecordSize()
		var resp struct {
			CreateStaff struct {
				ID   string
				Name string
			}
		}
		c.MustPost(`
		mutation {
			createStaff(input: {
				name: "create_staff_test",
				email: "create_staff_test@email.com",
				password: "password"
			}) {
				id
				name
			}
		}`, &resp)
		alen := getRecordSize()
		assert.Equal(t, blen+1, alen)
		assert.Equal(t, "create_staff_test", resp.CreateStaff.Name)
	})

	t.Run("CreateStaff: Email Invalid", func(t *testing.T) {
		var resp struct{}
		err := c.Post(`
		mutation {
			createStaff(input: {
				name: "create_staff_test",
				email: "",
				password: "password"
			}) {
				id
				name
			}
		}`, &resp)
		assert.Error(t, err)
	})

	t.Run("UpdateStaff: Success", func(t *testing.T) {
		var resp struct {
			UpdateStaff struct {
				ID   string
				Name string
			}
		}
		c.MustPost(fmt.Sprintf(`
		mutation {
			updateStaff(input: {
				id: %s
				name: "update_staff_test",
			}) {
				id
				name
			}
		}`, fid), &resp)
		assert.Equal(t, "update_staff_test", resp.UpdateStaff.Name)
	})

	t.Run("ChangeStaffPassword: Success", func(t *testing.T) {
		var resp struct {
			ChangeStaffPassword struct {
				ID string
			}
		}
		c.MustPost(fmt.Sprintf(`
		mutation {
			changeStaffPassword(input: {
				id: %s
				password: "password",
				newPassword: "newpassword"
			}) {
				id
			}
		}`, fid), &resp)
		assert.True(
			t,
			entity.Staff{}.IsAuthenticated(staffs[0].Email, "newpassword"),
		)
	})

	t.Run("UpdateStaffIcon: Success", func(t *testing.T) {
		var resp struct {
			UploadStaffIcon struct {
				ID   string
				Icon string
			}
		}
		c.MustPost(fmt.Sprintf(`
		mutation {
			uploadStaffIcon(input: {
				id: %s,
				icon: "text"
			}) {
				id
				icon
			}
		}`, fid), &resp)
		assert.Equal(t, "text", resp.UploadStaffIcon.Icon)
	})

	t.Run("DeleteStaffIcon: Success", func(t *testing.T) {
		var resp struct {
			DeleteStaffIcon struct {
				ID   string
				Icon string
			}
		}
		c.MustPost(fmt.Sprintf(`
		mutation {
			deleteStaffIcon(input: {
				id: %s,
			}) {
				id
				icon
			}
		}`, fid), &resp)
		assert.Equal(t, "", resp.DeleteStaffIcon.Icon)
	})

	t.Run("DeleteStaff: Success", func(t *testing.T) {
		blen := getRecordSize()
		var resp struct {
			DeleteStaff struct {
				ID string
			}
		}
		c.MustPost(fmt.Sprintf(`
		mutation {
			deleteStaff(input: {
				id: %s,
			}) {
				id
			}
		}`, fid), &resp)
		alen := getRecordSize()
		assert.Equal(t, blen-1, alen)
		assert.Equal(t, fid, resp.DeleteStaff.ID)
	})

	cleanStaffs()
}

func createStaffs(t *testing.T, size int) []entity.Staff {
	cleanStaffs()
	if size < 1 {
		return []entity.Staff{}
	}

	var staffs []entity.Staff
	hashed, _ := bcrypt.GenerateFromPassword([]byte("password"), 10)
	for i := 1; i <= size; i++ {
		staffs = append(staffs, entity.Staff{
			Name:           fmt.Sprintf("テスト%d", i),
			Email:          fmt.Sprintf("main_test%d@example.com", i),
			PasswordDigest: hashed,
		})
	}

	if err := database.GetDB().Create(&staffs).Error; err != nil {
		t.Fatal(err)
	}

	return staffs
}

func getRecordSize() int64 {
	var staffs []entity.Staff
	return database.GetDB().Find(&staffs).RowsAffected
}

func cleanStaffs() {
	database.GetDB().Exec("DELETE FROM staffs")
}
