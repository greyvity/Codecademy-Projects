class School {
  constructor(name, level, students) {
    this._name = name;
    this._level = level;
    this._numOfStudents = students;
  }

  //GETTERS

  get name() {
    return this._name;
  }
  get level() {
    return this._level;
  }
  get numOfStudents() {
    return this._numOfStudents;
  }

  //SETTERS
  set numOfStudents(number) {
    if (typeof number === "number") {
      this._numOfStudents = number;
    } else {
      console.log("Wrong Input");
    }
  }

  //METHODS

  quickFacts() {
    console.log(
      `${this.target} educates ${this._numOfStudents} students at the ${this._level} school level`
    );
  }

  static pickSubstituteTeacher(substituteTeachers) {
    const random = Math.floor(Math.random() * substituteTeachers.length);
    return substituteTeachers(random);
  }
}

class Junior extends School {
  constructor(name, students, pickUpPolicy) {
    super(name, "Junior", students);
    this._pickUpPolicy = pickUpPolicy;
  }

  // GETTERS

  get pickUpPolicy() {
    return this._pickUpPolicy;
  }

  // SETTERS

  // set pickUpPolicy(policy) {
  //   if (typeof policy === "string") {
  //     this._pickUpPolicy = policy;
  //   }
  // }
}

class Middle extends School {
  constructor(name, students) {
    super(name, "Middle", students);
  }
}

class High extends School {
  constructor(name, level, students, sportsTeams) {
    super(name, "High", students);
    this._sportsTeams = sportsTeams;
  }

  // GETTERS

  get sportsTeams() {
    return this._sportsTeams;
  }

  //SETTERS

  set sportsTeams(sport) {
    if (typeof sport === "string") {
      this._sportsTeams.push(sport);
    } else {
      console.log("Wrong input");
    }
  }
}

const primary = new Junior(
  "Lorraine",
  514,
  "Students must be picked up by a parent, guardian, or a family member over the age of 13."
);

primary.quickFacts();

School.pickSubstituteTeacher([
  "Jamal Crawford",
  "Lou Williams",
  "J. R. Smith",
  "James Harden",
  "Jason Terry",
  "Manu Ginobli",
]);
