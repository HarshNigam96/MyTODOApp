import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Image,
  ScrollView,
  LogBox,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';

LogBox.ignoreAllLogs();
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectOption: '',
      task: '',
      place: '',
      date: '',
      imageUrl: '',
      listType: 'All',
      allDay: false,
      error: '',
      popUpTxt: '',
      todos: [],
      activeTasks: [],
      taskDone: [],
    };
  }
  pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({
        imageUrl: image.path,
      });
    });
  };

  onAdd = () => {
    const {todos, imageUrl, selectOption, task, place, date, allDay} =
      this.state;
    if (task === '' || place === '' || date === '') {
      this.setState({
        error: '*Required',
      });
    } else {
      this.setState({
        todos: [
          ...todos,
          {
            imageUrl: imageUrl,
            category: selectOption,
            task: task,
            place: place,
            date: date,
            allDay: allDay,
          },
        ],
        imageUrl: '',
        task: '',
        place: '',
        date: '',
      });
    }
  };
  onDone = (item, id) => {
    const {activeTasks} = this.state;
    activeTasks.splice(id, 1);
    this.setState({
      activeTasks,
    });
    this.state.taskDone.push(item);
    setTimeout(() => {
      this.setState({
        popUpTxt: 'Task Completed...',
      });
    });
    setTimeout(() => {
      this.setState({
        popUpTxt: '',
      });
    }, 3000);
  };

  activateTask = item => {
    this.state.activeTasks.push(item);
    setTimeout(() => {
      this.setState({
        popUpTxt: 'Task Activated...',
      });
    });
    setTimeout(() => {
      this.setState({
        popUpTxt: '',
      });
    }, 3000);
  };
  onDelete = index => {
    const {taskDone} = this.state;
    taskDone.splice(index, 1);
    this.setState({
      taskDone,
    });
    setTimeout(() => {
      this.setState({
        popUpTxt: 'Task Deleted...',
      });
    });
    setTimeout(() => {
      this.setState({
        popUpTxt: '',
      });
    }, 3000);
  };
  render() {
    const {
      modalVisible,
      selectOption,
      task,
      place,
      date,
      imageUrl,
      listType,
      allDay,
      todos,
      taskDone,
      activeTasks,
      popUpTxt,
    } = this.state;
    const options = [
      {option: 'All things'},
      {option: 'Business'},
      {option: 'Personal'},
      {option: 'Family'},
      {option: 'Work'},
    ];
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.secondContainer}>
            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={this.pickImage}>
              {imageUrl === '' ? (
                <Entypo name="circle-with-plus" size={80} color="grey" />
              ) : (
                <Image style={styles.selectedImg} source={{uri: imageUrl}} />
              )}
            </TouchableOpacity>

            <View style={styles.inputs}>
              <Picker
                mode="dropdown"
                selectedValue={selectOption}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({selectOption: itemValue})
                }>
                {options.map((item, index) => (
                  <Picker.Item
                    label={item.option}
                    value={item.option}
                    key={index}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              value={task}
              onChangeText={val =>
                this.setState({
                  task: val,
                  error: '',
                })
              }
              style={styles.inputs}
              placeholder="What I have to do?"
              placeholderTextColor="black"
            />
            <TextInput
              value={place}
              onChangeText={val =>
                this.setState({
                  place: val,
                  error: '',
                })
              }
              style={styles.inputs}
              placeholder="Where?"
              placeholderTextColor="black"
            />
            <View style={styles.datePickerContainer}>
              <DatePicker
                style={{width: wp(65)}}
                date={date}
                mode="date"
                placeholder="When?"
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                  },
                }}
                onDateChange={date => {
                  this.setState({date: date, error: ''});
                }}
              />
              <View style={styles.toggleButtonContainer}>
                <Text style={{marginRight: hp(1.5)}}>All Day</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      allDay: !allDay,
                    })
                  }
                  style={[
                    styles.toggleButton,
                    {backgroundColor: allDay ? 'red' : 'grey'},
                  ]}
                />
              </View>
            </View>
            <Text
              style={[
                styles.lightTxt,
                {marginLeft: wp(2), fontSize: 16, marginBottom: hp(1)},
              ]}>
              {this.state.error}
            </Text>
            <TouchableOpacity
              disabled={
                task === '' || place === '' || date === ''
                  ? 'white'
                  : 'red'
                  ? false
                  : true
              }
              style={[
                styles.addButtonContainer,
                {
                  backgroundColor:
                    task === '' || place === '' || date === ''
                      ? 'white'
                      : 'red',
                },
              ]}
              onPress={this.onAdd}>
              <Text
                style={[
                  styles.addTaskTxt,
                  {
                    color:
                      task === '' || place === '' || date === ''
                        ? '#ccc'
                        : 'white',
                  },
                ]}>
                ADD TASK
              </Text>
            </TouchableOpacity>
            <Text style={styles.summaryTxt}>Summary</Text>
            <View style={styles.counting}>
              <Text>All things</Text>
              <Text> {todos.length}</Text>
            </View>
            <View style={styles.counting}>
              <Text>Business</Text>
              <Text>
                {todos.filter(val => val.category === 'Business').length}
              </Text>
            </View>
            <View style={styles.counting}>
              <Text>Personal</Text>
              <Text>
                {todos.filter(val => val.category === 'Personal').length}
              </Text>
            </View>
            <View style={styles.counting}>
              <Text>Family</Text>
              <Text>
                {todos.filter(val => val.category === 'Family').length}
              </Text>
            </View>
            <View style={styles.counting}>
              <Text>Work</Text>
              <Text>{todos.filter(val => val.category === 'Work').length}</Text>
            </View>

            <TouchableOpacity
              style={styles.viewTaskButtonContainer}
              onPress={() =>
                this.setState({
                  modalVisible: true,
                })
              }>
              <Text style={styles.addTaskTxt}>VIEW TASK</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalVisible}>
            <>
              <Entypo
                style={styles.closeIcon}
                name="cross"
                size={30}
                color="grey"
                onPress={() =>
                  this.setState({
                    modalVisible: false,
                  })
                }
              />
              <FlatList
                contentContainerStyle={{flexGrow: 1}}
                data={
                  listType === 'All'
                    ? todos
                    : listType === 'Active'
                    ? activeTasks
                    : taskDone
                }
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text>
                      {listType === 'All'
                        ? "Nothing to do yet? think about it and let's start!"
                        : listType === 'Active'
                        ? 'No Active task is available here'
                        : 'Please Finish your task first!!'}
                    </Text>
                  </View>
                )}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                      listType === 'All'
                        ? this.activateTask(item, index)
                        : listType === 'Active'
                        ? this.onDone(item, index)
                        : this.onDelete(index)
                    }>
                    {item.imageUrl === '' ? (
                      <View style={styles.msgIcon}>
                        <Entypo name="chat" size={15} color="grey" />
                      </View>
                    ) : (
                      <Image
                        style={{
                          height: wp(10),
                          width: wp(10),
                          borderRadius: 100,
                        }}
                        source={{uri: item.imageUrl}}
                      />
                    )}
                    <View style={styles.todoTxtContainer}>
                      <Text numberOfLines={1}>{item.task}</Text>
                      <Text style={styles.lightTxt}>{item.place}</Text>
                    </View>
                    <View style={{right: wp(5), alignItems: 'center'}}>
                      <Text style={{color: 'grey'}}>
                        {item.allDay ? 'All Day' : null}
                      </Text>
                      <Text>{item.date}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
              {popUpTxt === '' ? null : (
                <Text style={styles.popUp}>{popUpTxt}</Text>
              )}

              {todos.length === 0 ? null : (
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.touchables,
                      {
                        borderColor: listType === 'All' ? 'red' : 'black',
                      },
                    ]}
                    onPress={() =>
                      this.setState({
                        listType: 'All',
                      })
                    }>
                    <Text>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        listType: 'Active',
                      })
                    }
                    style={[
                      styles.touchables,
                      {
                        borderColor: listType === 'Active' ? 'red' : 'black',
                      },
                    ]}>
                    <Text>Active</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        listType: 'Done',
                      })
                    }
                    style={[
                      styles.touchables,
                      {
                        borderColor: listType === 'Done' ? 'red' : 'black',
                      },
                    ]}>
                    <Text>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          </Modal>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    backgroundColor: 'white',
  },
  secondContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  inputs: {
    borderWidth: 1,
    margin: hp(1),
    borderColor: 'grey',
    paddingLeft: hp(2),
    color: 'black',
  },
  selectedImg: {
    height: wp(20),
    width: wp(20),
    borderRadius: 100,
  },
  counting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2.5),
  },
  addButtonContainer: {
    padding: hp(1.5),
    alignItems: 'center',
  },
  addTaskTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    padding: hp(2.5),
    marginHorizontal: wp(6),
    borderRadius: 10,
    marginTop: hp(1.5),
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: hp(1),
  },
  popUp: {
    alignSelf: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    borderRadius: 20,
    color: 'white',
    padding: hp(1.5),
    marginBottom: hp(0.5),
    position: 'absolute',
    bottom: hp(8),
  },
  msgIcon: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  todoTxtContainer: {
    width: wp(50),
    marginLeft: wp(3),
  },
  lightTxt: {
    color: 'grey',
  },
  summaryTxt: {
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center',
    marginTop: hp(1.5),
  },
  filterButtons: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: hp(1.5),
  },
  touchables: {
    borderWidth: 1,
    padding: hp(1.5),
    alignItems: 'center',
    width: wp(29),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: wp(3),
    marginTop: StatusBar.currentHeight,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    height: wp(4),
    width: wp(4),
    borderRadius: 100,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTaskButtonContainer: {
    marginTop: hp(1.5),
    backgroundColor: 'blue',
    alignSelf: 'center',
    padding: hp(2),
    borderRadius: 100,
    marginBottom: hp(1),
  },
});
