package entity

import (
	"fmt"
	"log"
	"os"
	"testing"

	"staff_api/database"

	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestStaffEntities(t *testing.T) {
	os.Setenv("GO_ENV", "test")
	db, err := database.Connect()
	if err != nil {
		log.Panic(err)
	}

	err = db.AutoMigrate(&Staff{})
	if err != nil {
		log.Panic(err)
	}

	t.Run("AllStaffs", testAllStaffs)
	t.Run("PaginatedStaffs", testPaginatedStaffs)
	t.Run("GetPageInfo", testGetPageInfo)
	t.Run("FindStaffByID", testFindStaffByID)
	t.Run("FindStaffByEmail", testFindStaffByEmail)
	t.Run("Create", testCreate)
	t.Run("Update", testUpdate)
	t.Run("Delete", testDelete)
	t.Run("ChangeIcon", testChangeIcon)
	t.Run("ChangePassword", testChangePassword)
	t.Run("IsAuthenticated", testIsAuthenticated)

	cleanStaffs()
}

func testAllStaffs(t *testing.T) {
	size := 10
	createStaffs(t, size)

	staffs, err := AllStaffs()
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, size, len(staffs))

	cleanStaffs()
}

func testPaginatedStaffs(t *testing.T) {
	createStaffs(t, 30)

	limit := 25
	offset := 0
	staffs, err := PaginatedStaffs(limit, offset)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, limit, len(staffs))

	offset = 25
	staffs, err = PaginatedStaffs(limit, offset)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, 5, len(staffs))

	limit = -2
	offset = 0
	_, err = PaginatedStaffs(limit, offset)

	assert.Error(t, err)

	limit = 25
	offset = -1
	_, err = PaginatedStaffs(limit, offset)

	assert.Error(t, err)

	cleanStaffs()
}

func testGetPageInfo(t *testing.T) {
	createStaffs(t, 30)

	per := 25
	page := 1
	info, err := GetPageInfo(per, page)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, PageInfo{
		CurrentPage:  1,
		RecordsCount: 30,
		PagesCount:   2,
		Limit:        25,
	}, *info)

	per = 10
	info, err = GetPageInfo(per, page)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, PageInfo{
		CurrentPage:  1,
		RecordsCount: 30,
		PagesCount:   3,
		Limit:        10,
	}, *info)

	page = 3
	info, err = GetPageInfo(per, page)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, PageInfo{
		CurrentPage:  3,
		RecordsCount: 30,
		PagesCount:   3,
		Limit:        10,
	}, *info)

	per = -1
	_, err = GetPageInfo(per, page)

	assert.Error(t, err)

	per = 25
	page = -1
	_, err = GetPageInfo(per, page)

	assert.Error(t, err)

	cleanStaffs()
}

func testFindStaffByID(t *testing.T) {
	s := createStaff(t)

	var staff Staff
	staff.FindStaffByID(fmt.Sprintf("%d", s.ID))

	assert.Equal(t, s.PasswordDigest, staff.PasswordDigest)

	staff = Staff{}
	err := staff.FindStaffByID("0")

	assert.Error(t, err)

	cleanStaffs()
}

func testFindStaffByEmail(t *testing.T) {
	s := createStaff(t)

	var staff Staff
	staff.FindStaffByEmail(s.Email)

	assert.Equal(t, s.PasswordDigest, staff.PasswordDigest)

	staff = Staff{}
	err := staff.FindStaffByEmail("test")

	assert.Error(t, err)

	cleanStaffs()
}

func testCreate(t *testing.T) {
	var staff Staff

	name := "テスト"
	email := "test100000@example.com"
	password := "password"
	bs := getRecordSize()
	staff.Create(name, email, password)

	assert.Equal(t, bs+1, getRecordSize())

	staff = Staff{}
	name = ""
	err := staff.Create(name, email, password)

	assert.Error(t, err)

	staff = Staff{}
	name = "テスト"
	email = "test100000"
	err = staff.Create(name, email, password)

	assert.Error(t, err)

	staff = Staff{}
	email = "test100000@example.com"
	password = "pass"
	err = staff.Create(name, email, password)

	assert.Error(t, err)

	cleanStaffs()
}

func testUpdate(t *testing.T) {
	s := createStaff(t)

	id := fmt.Sprintf("%d", s.ID)

	var staff Staff

	name := "テスト"
	email := "test100000@example.com"
	staff.Update(id, &name, &email)

	assert.Equal(t, email, staff.Email)

	var fs Staff
	database.GetDB().First(&fs, id)

	assert.Equal(t, email, fs.Email)

	name = ""
	err := staff.Update(id, &name, &email)

	assert.Error(t, err)

	name = "テスト"
	email = "test100000"
	err = staff.Update(id, &name, &email)

	assert.Error(t, err)

	cleanStaffs()
}

func testDelete(t *testing.T) {
	s := createStaff(t)

	var staff Staff

	id := "0"
	err := staff.Delete(id)

	assert.Error(t, err)

	id = fmt.Sprintf("%d", s.ID)
	staff = Staff{}
	staff.Delete(id)

	assert.Equal(t, int64(0), database.GetDB().First(&Staff{}, s.ID).RowsAffected)

	cleanStaffs()
}

func testChangeIcon(t *testing.T) {
	s := createStaff(t)

	id := fmt.Sprintf("%d", s.ID)

	var staff Staff
	iconStr := "testimagestring"
	staff.UpdateIcon(id, iconStr)

	assert.Equal(t, iconStr, staff.Icon)

	var fs Staff
	database.GetDB().First(&fs, id)

	assert.Equal(t, iconStr, fs.Icon)

	staff = Staff{}
	staff.DeleteIcon(id)

	assert.Equal(t, "", staff.Icon)

	fs = Staff{}
	database.GetDB().First(&fs, id)

	assert.Equal(t, "", fs.Icon)

	cleanStaffs()
}

func testChangePassword(t *testing.T) {
	s := createStaff(t)

	id := fmt.Sprintf("%d", s.ID)

	var staff Staff
	cps := "password"
	nps := "newpassword"
	staff.ChangePassword(id, cps, nps)

	assert.Equal(
		t,
		nil,
		bcrypt.CompareHashAndPassword(staff.PasswordDigest, []byte(nps)),
	)

	var fs Staff
	database.GetDB().First(&fs, id)

	assert.Equal(
		t,
		nil,
		bcrypt.CompareHashAndPassword(fs.PasswordDigest, []byte(nps)),
	)

	staff = Staff{}
	cps = nps
	nps = "pass"
	err := staff.ChangePassword(id, cps, nps)

	assert.Error(t, err)

	cleanStaffs()
}

func testIsAuthenticated(t *testing.T) {
	s := createStaff(t)

	e := s.Email
	p := "password"

	var staff Staff
	assert.Equal(t, true, staff.IsAuthenticated(e, p))

	staff = Staff{}
	p = "incorrectpassword"
	assert.Equal(t, false, staff.IsAuthenticated(e, p))

	cleanStaffs()
}

var staffCreatedTimes = 1000

func createStaff(t *testing.T) Staff {
	hashed, _ := bcrypt.GenerateFromPassword([]byte("password"), 10)
	staff := Staff{
		Name:           fmt.Sprintf("テスト%d", staffCreatedTimes),
		Email:          fmt.Sprintf("test%d@example.com", staffCreatedTimes),
		PasswordDigest: hashed,
	}

	if err := database.GetDB().Create(&staff).Error; err != nil {
		log.Fatal(err)
	}

	staffCreatedTimes++

	return staff
}

func createStaffs(t *testing.T, size int) []Staff {
	cleanStaffs()
	if size < 1 {
		return []Staff{}
	}

	var staffs []Staff
	hashed, _ := bcrypt.GenerateFromPassword([]byte("password"), 10)
	for i := 1; i <= size; i++ {
		staffs = append(staffs, Staff{
			Name:           fmt.Sprintf("テスト%d", i),
			Email:          fmt.Sprintf("entity_test%d@example.com", i),
			PasswordDigest: hashed,
		})
	}

	if err := database.GetDB().Create(&staffs).Error; err != nil {
		t.Fatal(err)
	}

	return staffs
}

func getRecordSize() int64 {
	var staffs []Staff
	return database.GetDB().Find(&staffs).RowsAffected
}

func cleanStaffs() {
	database.GetDB().Exec("DELETE FROM staffs")
}
