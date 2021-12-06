import Mock from 'mockjs'

Mock.mock('sso/login', 'post', (options) => {
    var data = Mock.mock({
        'token': '',
        'success': false,
        'errorMessage': '@csentence(10)'
    })

    let body = JSON.parse(options.body)
    console.log(body);

    if (body.username === '123' && body.password === '202cb962ac59075b964b07152d234b70') {
        data.token = 'user'
        data.success = true
    }

    if (body.username === '456' && body.password === '250cf8b51c773f3f8dc8b4be867a9a02') {
        data.token = 'admin'
        data.success = true
    }

    if (body.username === 'asd' && body.password === '7815696ecbf1c96e6894b779456d330e') {
        data.token = 'dev'
        data.success = true
    }

    return data
})

Mock.mock('sso/logout', 'post', () => {
    var data = Mock.mock({
        'success': true,
        'errorMessage': '@csentence(10)'
    })

    return data
})

Mock.mock('index/userInformation', 'get', option => {
    var data = Mock.mock({
        'user_name': '@cname',
        'user_role': 1, //0代表有后台�?�理权限
        'unread_message|0-99': 1
    })

    switch (localStorage.getItem('token')) {
        case 'admin':
            data.user_role = 0;
            break;
        case 'dev':
            data.user_role = 0;
            break;
        case 'nbaduser':
            data.userType = 0;
            break;
    }

    return data
})

Mock.mock('home/activityListAll', 'get', () => {
    var data = Mock.mock({
        'activities|6-20': [{
            'activity_id|66-99': 77,
            'activity_name': '@csentence(3, 9)',
            'activity_start|1605732179000-1609779559624': 1605732179000,
            'activity_end|1605732179000-1609779559624': 1605732179000,
            'activity_desc': '@csentence(3, 20)',
            'activity_founder': '@cname',
            'activity_place': '@city',
            'activity_capacity|0-999': 3
        }]
    })

    return data
})

Mock.mock('getFounders', 'get', options => {
    var data = Mock.mock({
        'founders|6-10': [{
            'association_id|20-90': 21,
            'association_name': '@cname'
        }]
    })

    return data
})

Mock.mock('user/roleList', 'get', options => {
    var data = Mock.mock({
        'roles|6-10': [{
            'role_id|0-3': 1,
            'role_name': '@city'
        }]
    })

    return data
})

Mock.mock('classroom/empty_classroom', 'post', options => {
    let body = JSON.parse(options.body)

    var data = Mock.mock({
        'rooms|6-10': [{
            'classroom_id|66-99': 77,
            'classroom_name': '@city',
            'classroom_capacity|0-999': 3
        }]
    })

    return data
})

Mock.mock('classroom/classroomListAll', 'get', () => {
    var data = Mock.mock({
        'classRooms|10-20': [{
            'classroom_id|66-99': 77,
            'classroom_name': '@city',
            'classroom_capacity|0-999': 3
        }]
    })

    return data
})

Mock.mock('user/userList', 'get', () => {
    var data = Mock.mock({
        'users|10-20': [{
            'user_id': '@id',
            'user_name': '@cname',
            'user_roleName': '@city'
        }]
    })

    return data
})

Mock.mock('activity/addActivity', 'post', options => {
    let body = JSON.parse(options.body)

    console.log(body);

    return { success: true }
})

Mock.mock('classroom/addClassroom', 'post', options => {
    let body = JSON.parse(options.body)

    console.log(body);

    return { success: true }
})

Mock.mock('user/add_user', 'post', options => {
    let body = JSON.parse(options.body)

    console.log(body);

    return { success: true }
})

Mock.mock('activity/deleteActivity', options => {
    let body = JSON.parse(options.body)

    console.log(body);

    return { success: true }
})

Mock.mock('classroom/deleteClassroom', options => {
    let body = JSON.parse(options.body)

    console.log(body);

    return { success: true }
})

Mock.mock('user/delete_user', options => {
    let body = JSON.parse(options.body)

    console.log(body);

    return { success: true }
})

Mock.mock('getMessageList', 'get', options => {
    var data = Mock.mock({
        'messages': [{
                'message_id|66-99': 77,
                'message_type': 0,
                'message_time|1605732179000-1609779559624': 1605732179000,
                'status': 0,
                'approver_read|0-1': 1,
                'applicator_name': '@cname',
                'association_name': '@csentence(3,5)',
                'activity_name': '@csentence(3,5)'
            },
            {
                'message_id|66-99': 77,
                'message_type': 0,
                'message_time|1605732179000-1609779559624': 1605732179000,
                'status|1-2': 0,
                'approver_read': 1,
                'applicator_name': '@cname',
                'association_name': '@csentence(3,5)',
                'activity_name': '@csentence(3,5)'
            },
            {
                'message_id|66-99': 77,
                'message_type': 1,
                'message_time|1605732179000-1609779559624': 1605732179000,
                'status|1-2': 0,
                'approver_read|0-1': 1,
                'applicator_name': '@cname',
                'association_name': '@csentence(3,5)',
                'activity_name': '@csentence(3,5)'
            },
            {
                'message_id|66-99': 77,
                'message_type': 3,
                'message_time|1605732179000-1609779559624': 1605732179000,
                'status|1-2': 0,
                'approver_read|0-1': 1,
                'applicator_name': '@cname',
                'association_name': '@csentence(3,5)',
                'activity_name': '@csentence(3,5)'
            },
            {
                'message_id|66-99': 77,
                'message_type': 5,
                'message_time|1605732179000-1609779559624': 1605732179000,
                'status|1-2': 0,
                'approver_read|0-1': 1,
                'applicator_name': '@cname',
                'association_name': '@csentence(3,5)',
                'activity_name': '@csentence(3,5)'
            },
            {
                'message_id|66-99': 77,
                'message_type': 2,
                'message_time|1605732179000-1609779559624': 1605732179000,
                'status': 0,
                'approver_read': 0,
                'applicator_name': '@cname',
                'association_name': '@csentence(3,5)',
                'activity_name': '@csentence(3,5)'
            },
            {
                'message_id|66-99': 77,
                'message_type': 4,
                'message_time|1605732179000-1609779559624': 1605732179000,
                'status': 0,
                'approver_read': 0,
                'applicator_name': '@cname',
                'association_name': '@csentence(3,5)',
                'activity_name': '@csentence(3,5)'
            }
        ]
    })

    return data
})

Mock.mock('dealMessage', 'post', options => {
    let body = JSON.parse(options.body)
    console.log(body);
    return Mock.mock({ 'success': '@boolean', 'errorMessage': '@csentence(3, 9)' })
})

Mock.mock('database/getDBList', 'get', {
    database: [
        'activity',
        'user'
    ]
})

Mock.mock('database/getTableList', 'post', options => {
    let body = JSON.parse(options.body)

    var data = { tableName: [] }

    switch (body.dbName) {
        case 'activity':
            data.tableName = ['activity'];
            break;
        case 'user':
            data.tableName = ['school_role', 'school_user'];
            break;
    }

    return data
})

Mock.mock('database/listByTableName', 'post', options => {
    let body = JSON.parse(options.body)

    var data = Mock.mock({
        'activities|6-20': [{
            'activity_id|66-99': 77,
            'activity_name': '@csentence(3, 9)',
            'activity_start|1605732179000-1609779559624': 1605732179000,
            'activity_end|1605732179000-1609779559624': 1605732179000,
            'activity_desc': '@csentence(3, 20)',
            'activity_founder': '@cname',
            'activity_place': '@city',
            'activity_capacity|0-999': 3
        }],
        'school_role|6-20': [{
            'id|66-99': 77,
            'isTeacher': '@boolean'
        }],
        'school_user|6-20': [{
            'activity_id|66-99': 77,
            'activity_name': '@csentence(3, 9)',
            'activity_start|1605732179000-1609779559624': 1605732179000,
            'activity_end|1605732179000-1609779559624': 1605732179000,
            'activity_desc': '@csentence(3, 20)',
            'activity_founder': '@cname',
            'activity_place': '@city',
            'activity_capacity|0-999': 3
        }]
    })

    // var headType = {}
    // var nullable = {}
    var columns = {}
    for (let table in data) {
        // var temp = {}
        // var temp2 = {}
        var temp3 = []
        for (let item in data[table][0]) {
            if (item == 'activity_start') {
                temp3.push({ column_name: item, column_type: 'bigint', column_isnull: false })
            } else {
                temp3.push({ column_name: item, column_type: typeof(data[table][0][item]), column_isnull: false })
            }
            // temp[item] = typeof(data[table][0][item])
            // temp2[item] = false
        }
        // headType[table] = temp
        // nullable[table] = temp2
        columns[table] = temp3
    }


    switch (body.tableName) {
        case 'activity':
            return { key: "activity_id", columns: columns['activities'], data: JSON.stringify(data.activities) }
        case 'school_role':
            return { key: "id", columns: columns['school_role'], data: JSON.stringify(data.school_role) }
        case 'school_user':
            return { key: "activity_id", columns: columns['school_user'], data: JSON.stringify(data.school_user) }
    }

    return { tableData: null }
})

Mock.mock('database/updateData', 'post', options => {
    let body = JSON.parse(options.body)

    console.log('modify');
    console.log(body);

    return { success: true, err_message: '�?改出�?' }
})

Mock.mock('database/deleteById', 'post', options => {
    let body = JSON.parse(options.body)

    console.log('delete');
    console.log(body);

    return { success: true, err_message: '删除出错' }
})

Mock.mock('database/addData', 'post', options => {
    let body = JSON.parse(options.body)

    console.log('add');
    console.log(body);

    return { success: true, err_message: '添加出错' }
})

//我的社团
Mock.mock('getMyAssociation', 'get', option => {

    var data = Mock.mock({
        'my_associations|6-10': [{
            'association_id|1-100': 10,
            'association_name': '@cname',
            'association_founder': '@cname',
            'association_count|10-100': 100,
            'association_intro': '@csentence(5, 20)',
            'student_position': '@cname'

        }]
    })

    return data
})

//社团列表
Mock.mock('getAssociationList', 'get', option => {

    var data = Mock.mock({
        'associations|6-10': [{
            'association_id|2021110-2021999': 2021113,
            'association_name': '@cname',
            'association_founder': '@cname',
            'association_count|10-100': 100,
            'association_intro': '@csentence(5, 20)',
            'status|0-2': 0

        }]
    })
    return data
})

Mock.mock('applyAssociation', 'post', option => {

    var data = Mock.mock({
        'Status': 1
    })
    return data
})

//用户管理
Mock.mock('userManage', 'post', option => {
    //console.log(option.body);

    var data = Mock.mock({
        'authority_members|6-30': [{
            'student_id|2021110-2021999': 2021113,
            'student_name': '@cname',
            'student_position': ['副部长']
        }]
    })
    return data
})

//�?改用户等�?
Mock.mock('changeStudent', 'post', option => {
    var data = {
        'state': 1
    }
    return data
})

//得到等级选项
Mock.mock('getStudentPosition', 'get', {
    position_data: [
        '社长',
        '�?社长',
        '部长',
        '部�??',
        '成员',
    ]
})

//权限管理
Mock.mock('authorityManage', 'post', option => {
    //console.log(option.body);

    var data = Mock.mock({
        'authorities|6-30': [{
            'position_name': '@cname',
            'position_level|1-9': 3,
            'ability_add': '@boolean',
            'ability_delete': '@boolean',
            'ability_event_application': '@boolean'
        }]
    })
    return data
})

//�?改等级权�?
Mock.mock('changePositionLevel', 'post', option => {
    var data = {
        'state': 1
    }
    return data
})

//�?改等级权�?
Mock.mock('changeAbilityAdd', 'post', option => {
    var data = {
        'state': 1
    }
    return data
})
Mock.mock('changeAbilityDelete', 'post', option => {
    var data = {
        'state': 1
    }
    return data
})
Mock.mock('changeEventApplication', 'post', option => {
    var data = {
        'state': 1
    }
    return data
})


//图表测试
Mock.mock('statistics/dau', 'post', option => {
    //const Random = Mock.Random
    var data = Mock.mock({
        'dates|7': ['@cname'],
        'daus|7': ['@float(60, 100, 2, 2)']
    })
    return data
})

//最活跃时间�?
Mock.mock('statistics/api_frequency', 'post', option => {
    //const Random = Mock.Random
    var data = Mock.mock({
        'periods|8': ['@cname'],
        'calls|8': ['@float(60, 100, 2, 2)']
    })
    return data
})

//页面访问频率
Mock.mock('statistics/page_frequency', 'post', option => {
    //const Random = Mock.Random
    var data = Mock.mock({
        'scenes|6': ['@cname'],
        'frequencies': [10, 20, 13, 15, 60, 17]
    })
    return data
})


//异常�?
Mock.mock('statistics/service_errors', 'post', option => {
    //const Random = Mock.Random
    var data = Mock.mock({
        'services|3': ['@cname'],
        //'counts|3': ['@float(60, 100, 2, 2)']
        'counts': [10, 20, 30]
    })

    return data
})

//活动参加人数
Mock.mock('activity/userCounts', 'get', option => {
    //const Random = Mock.Random
    var data = Mock.mock({
        'user_name|3': ['@cname'],
        'times|3': ['@float(60, 100, 2, 2)']
    })
    return data
})

//最受�?�迎社团
Mock.mock('getApplyNumber', 'get', option => {
    //const Random = Mock.Random
    var data = Mock.mock({
        'association_names|20': ['@cname'],
        'association_numbers|20': ['@float(60, 100, 2, 2)']
    })
    return data
})