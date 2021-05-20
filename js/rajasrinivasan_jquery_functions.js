// call the functions to display the content when the document is ready
$(document).ready(function(){
    $(".button-collapse").sideNav(); //initialize the side navbar
    about();
    ugDegrees();
    gradDegrees();
    minors();
    employment();
    people();
    research();
    researchFaculty();
    footer();
    resources();
});

// function to retreive and display the about details and quote
function about(){
    myXhr('get', {path:'/about/'}, '#about').done(function(json){
        var text = '';     //variable to store the html 
        text += '<h2>'+json.title+'</h2><p class="about-description">' + json.description + '</p>';
        text += '<blockquote>' + json.quote + '</blockquote>' + '<cite> - ' + json.quoteAuthor + '</cite>';
        $('#about').html(text); //write to html document
    });
}

// function to retreive the undergrad degrees and display in the html document
function ugDegrees(){
    var imgArray = ['img/undergrad/wmc.jpg', 'img/undergrad/hcc.jpg', 'img/undergrad/cits.jpg']; // Images for the cards
    var website = ['http://wmc.rit.edu', 'http://hcc.rit.edu', 'http://cit.rit.edu']; // link for the departments
    myXhr('get', {path:'/degrees/'}, '#undergrad-degrees').done(function(json){
        var text = '';  //variable to store the html 
        $.each(json.undergraduate, function(i){
            text += '<div class="col s12 m6 l4">'; //displaying details in card
            text += '<div class="card medium"><div class="card-image waves-effect"><img src='+ imgArray[i] +'></div><div class="card-content">';
            text += '<h4 class="degree-name activator">' + this.title + '</h4>';
            text += '</div><div class="card-reveal"><span class="card-title">' + this.title + '</span>';
            text += '<p class="degree-description">' + this.description + '</p>';
            text += '<p class="center-align">concentrations:</p>';
            text += '<ul class="degree-concentration-list">';
            $.each(this.concentrations, function(){   //loop to retreive multiple values
                text += '<li class="degree-concentration">' + this + '</li>';
            });
            text += '</ul>';
            text += '<p class="learn-more">To learn more, <br>visit:  <a href="' + website[i] + '">' + website[i] + '</a></p>';
            text += '</div></div></div>';
        });

        $('#undergrad-degrees').html(text); //write to html document
    });
}

//  function to retreiv grad Degrees and display in the html document
function gradDegrees(){
    var imgArray = ['img/grad/ist.jpg', 'img/grad/hci.jpg', 'img/grad/nsa.jpg']; //images for the cards
    var website = ['http://it.rit.edu', 'http://hci.rit.edu', 'http://nsa.rit.edu']; //link to the department
    myXhr('get', {path:'/degrees/'}, '#grad-degrees').done(function(json){
        var text = '';  //variable to store html
        $.each(json.graduate, function(i){
            console.log(this.degreeName, this.title, this.description);
            if (this.availableCertificates){   // not displaying certificate course. If condition to skip certificate courses.
            }
            else {
                text += '<div class="col s12 m6 l4">';  //displaying details in card
                text += '<div class="card medium"><div class="card-image waves-effect"><img src="'+ imgArray[i] +'"></div><div class="card-content">';
                text += '<h4 class="degree-name activator">' + this.title + '</h4>';
                text += '</div><div class="card-reveal"><span class="card-title">' + this.title + '</span>';
                text += '<p class="degree-description">' + this.description + '</p>';
                text += '<p class="center-align">oncentrations</p>';
                text += '<ul class="degree-concentration-list">';
                $.each(this.concentrations, function(){ ////loop to retreive multiple values
                    text += '<li class="degree-concentration">' + this + '</li>';
                });
                text += '</ul>';
                text += '<p class="learn-more">To learn more, <br>visit: <a href="' + website[i] + '">' + website[i] + '</a></p>';
                text += '</div></div></div>';
            }
        });
        $('#grad-degrees').html(text); //write to html document
    });
}


// function to retreive and display the undergrad minors
function minors(){
    var icon = ['fa-database', 'fa-map-marker', 'fa-medkit', 'fa-code', 'fa-mobile', 'fa-sitemap', 'fa-html5', 'fa-object-group']; //icons from font awesome 
    myXhr('get', {path:'/minors/'}, '#undergrad-minors').done(function(json){
        var text = '';  //variable to store html
        text += '<div class="accordion1">'; //accordion for minors detail
        $.each(json.UgMinors, function(i){
            text += '<h4 class=" collapsible-header" href="#' + this.name +'"  onclick="minorInfo(this);" data-minor="' + this.name + '">';
            text += '<i class="fa ' + icon[i] + ' activator fa-4x" aria-hidden="true"></i>'+ this.title + '</h4>';
            text += '<div class=" collapsible-body" id="' + this.name +'"><div class="modal-content" id="' + this.name + '-content"></div></div>';  
        });
        text += '</div>';
        $('#undergrad-minors').html(text); //write to html document
        $(".accordion1").accordion({       //initialize accordion
            collapsible: true,
            active: false,
            heightStyle: "content"
        });
    });
}

// function to display minor info inside the accordion
function minorInfo(dom){
    var minorName = '#'+$(dom).attr('data-minor'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/minors/UgMinors/name=' + $(dom).attr('data-minor')}, minorName+'-content').done(function(json){
        var text = '';   //variable to hrml
        text += '<h5><b> Minor: ' + json.title + '</b></h5><p>' + json.description + '</p>';
        text += '<p>Courses:</p>'
        text += '<div class="accordion">'; //accordion for the minor courses
        $.each(json.courses, function(){
            text += '<h5 class="collapsible-header" onclick="getCourse(this);"  data-courseID="' + this + '">' + this + '</h5>';
            text += '<div class="collapsible-body" id="' + this + '-content"></div>';
        });
        text += '</div><p>' + json.note + '</p>';
        $(minorName+'-content').html(text);  //setting  outer accordion content
        $( ".accordion" ).accordion({     //initialize accordion
            collapsible: true,
            active: false,
            heightStyle: "content"
        });
    });
}

// function to retreive the minor courses
function getCourse(dom){ 
    var courseID = '#'+$(dom).attr('data-courseID'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/course/courseID=' +  $(dom).attr('data-courseID')}, courseID+'-content').done(function(json){
        var text = ''; //variable to store html
        text += '<p><strong>' + json.title + '</strong> (' + json.courseID + ')</p>';
        text += '<p class="course-description">' + json.description + '</p>';
        $(courseID+'-content').html(text);  //setting inner accordion content
    });
}

// function to display employment statistics
function employment(){
    myXhr('get', {path:'/employment/'}, '#employment').done(function(json){
        var text = ''; //variable to store html
        text += '<div class="col s12"><h2>' + json.introduction.title + '</h2></div>';
        $.each(json.introduction.content, function(){ //loop to get multiple values
            text += '<div class="col s12">';
            text += '<h3>' + this.title + '</h3><p>' + this.description + '</p>';
            text += '</div>';
        });
        text += '<div class="col s12 m6 l6"><h3>' + json.employers.title + '</h3>';
        $.each(json.employers.employerNames, function(){   //employers
            text += '<p class="employment">' + this + '</p>';
        });
        text += '</div>';
        text += '<div class="col s12 m6 l6"><h3>' + json.careers.title + '</h3>';
        $.each(json.careers.careerNames, function(){      //careers
            text += '<p class="employment">' + this + '</p>';
        });
        text += '</div>';
        text += '<div class="col s12"><h3>' + json.degreeStatistics.title + '</h3>';  //statistics
        $.each(json.degreeStatistics.statistics, function(){
            console.log(this.value,'====',this.description)
            text += '<div class="col s12 m6 l3">';  //displaying details in card
            text += '<div class="card-panel"><h4>' + this.value + '</h4><p>' + this.description + '</p>';
            text += '</div>';
            text += '</div>';
        });
        text += '</div>';
        $('#employment').html(text); //write to html document
    });
}

// function to display co-op records
function coopTable(){
    myXhr('get', {path:'/employment/coopTable/'}, '#coopTable').done(function(json){
        var text = ''; //variable to store html
        text += '<h2>' + json.coopTable.title + '</h2></div>';
        text += '<table class="employmentTable tablesorter highlight striped responsive-table" style="table-layout: fixed;"><thead><tr><th>Employer</th><th>Degree</th><th>City</th><th>Term</th></tr></thead>';
        $.each(json.coopTable.coopInformation, function(){ //loop to create table
            text += '<tr>';
            text += '<td>' + this.employer + '</td><td>' + this.degree + '</td><td>' + this.city + '</td><td>' + this.term + '</td>';
            text += '</tr>';
        });
        text += '</table>';
        $('#coopTable-content').html(text); //write to modal
        $(".tablesorter").tablesorter();  //table sorter plugin to sort the table based on the headers
    });
}

// function to display employment records
function employmentTable(){
    myXhr('get', {path:'/employment/employmentTable/'}, '#employmentTable').done(function(json){
        var text = ''; //variable to store html
        text += '<h2>' + json.employmentTable.title + '</h2>';
        text += '<table class="employmentTable tablesorter highlight striped" style="table-layout: fixed;"><thead><tr><th>Employer</th><th>Degree</th><th>City</th><th>Title</th><th>Start Date</th></tr></thead>';
        $.each(json.employmentTable.professionalEmploymentInformation, function(){ //loop to create table
            text += '<tr>';
            text += '<td>' + this.employer + '</td><td>' + this.degree + '</td><td>' + this.city + '</td><td>' + this.title + '</td><td>' + this.startDate + '</td>';
            text += '</tr>';
        });
        text += '</table>';
        $('#employmentTable-content').html(text); //write to modal
        $(".tablesorter").tablesorter();    //table sorter plugin to sort the table based on the headers
    });
}

// function to display faculty and staffs
function people(){
    myXhr('get', {path:'/people/'}, '#people').done(function(json){
        var text = ''; //variable to store html
        text += '<h2>' + json.title + '</h2>' + '<p class="center-align">' + json.subTitle + '</p>';
        $.each(json.faculty, function(){  //loop to get multiple faculty details
            text += '<div class="col s12 m6 l3 faculty-staff">';
            text += '<img src="' + this.imagePath + '" class="facultyImg" alt="" />';
            text += '<a class="waves-effect waves-light btn modal-trigger" href="#' + this.username +'"  onclick="faculty(this);" data-username="' + this.username + '">' + this.name + '</a></div>';
            text += '<div class="modal faculty-staff" id="' + this.username +'"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="' + this.username + '-content"></div></div>';
        });
        $.each(json.staff, function(){ //loop to get multiple staff details
            text += '<div class="col s12 m6 l3 faculty-staff">';
            text += '<img src="' + this.imagePath + '" class="facultyImg" alt="" />';
            text += '<a class="waves-effect waves-light btn casal modal-trigger" href="#' + this.username +'"  onclick="staff(this);" data-username="' + this.username + '">' + this.name + '</a></div>';
            text += '<div class="modal faculty-staff" id="' + this.username +'"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="' + this.username + '-content"></div></div>';
        });
        $('#people').html(text); //write to html document
        $('.modal-trigger').leanModal(); //initialize modal
    });
}

// function to populate modal with faculty details
function faculty(dom){
    var usernameID = '#'+$(dom).attr('data-username'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/people/faculty/username=' + $(dom).attr('data-username')}, usernameID+'-content').done(function(json){
        var text = ''; //variable to store html
        text += json.username == "" ? '' : '<h3 style="color:black;">' + json.name + '</h3>';
        text += json.title == "" ? '' : '<h4>' + json.title + '</h4>';
        text += json.imagePath == "" ? '' : '<img src="' + json.imagePath + '"/>';
        text += '<ul>';  //checking if the value is null. if null display nothing else disply the data
        text += json.interestArea == ""  || json.interestArea == null ? '' : '<li> Interest Area: ' + json.interestArea + '</li>';
        text += json.office == ""  || json.office == null ? '' : '<li><i class="fa fa-map-marker" aria-hidden="true"></i> ' + json.office + '</li>';
        text += json.website == ""  || json.website == null ? '' : '<li><i class="fa fa-globe" aria-hidden="true"></i><a href="' + json.website + '">' + json.website + '</a></li>';
        text += json.phone == "" || json.phone == null ? '' : '<li><i class="fa fa-phone" aria-hidden="true"></i> ' + json.phone + '</li>';
        text += json.email == "" || json.email == null ? '' : '<li><i class="fa fa-envelope" aria-hidden="true"></i><a href="mailto:' + json.email + '">' + json.email + '</a></li>';
        text += '</ul>';
        $(usernameID+'-content').html(text); //write to modal
    });
}

// function to populate modal with staff details
function staff(dom){
    var usernameID = '#'+$(dom).attr('data-username'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/people/staff/username=' + $(dom).attr('data-username')}, usernameID+'-content').done(function(json){
        var text = ''; //variable to store html
        text += json.username == "" ? '' : '<h3 class="casal-text">' + json.name + '</h3>';
        text += json.title == "" ? '' : '<h4>' + json.title + '</h4>';
        if(json.imagePath == null){
            json.imagePath = 'img/icon.png';        //displaying dummy image if image is not available in the server
        }
        text += json.imagePath == "" ? '<img src="img/icon.png"/>' : '<img src="' + json.imagePath + '"/>';
        text += '<ul>';    //checking if the value is null. if null display nothing else disply the data
        text += json.interestArea == ""  || json.interestArea == null ? '' : '<li> Interest Area: ' + json.interestArea + '</li>';
        text += json.office == ""  || json.office == null ? '' : '<li><i class="fa fa-map-marker" aria-hidden="true"></i> ' + json.office + '</li>';
        text += json.website == ""  || json.website == null ? '' : '<li><i class="fa fa-globe" aria-hidden="true"></i><a href="' + json.website + '">' + json.website + '</a></li>';
        text += json.phone == "" || json.phone == null ? '' : '<li><i class="fa fa-phone" aria-hidden="true"></i> ' + json.phone + '</li>';
        text += json.email == "" || json.email == null ? '' : '<li><i class="fa fa-envelope" aria-hidden="true"></i><a href="mailto:' + json.email + '">' + json.email + '</a></li>';
        text += '</ul>';
        $(usernameID+'-content').html(text); //write to modal
    });
}

// function to display the research areas
function research(){
    myXhr('get', {path:'/research/'}, '#research-area').done(function(json){
        var text = ''; //variable to store html
        $.each(json.byInterestArea, function(i){ 
            var areaNS = this.areaName.replace(/\s/g, ""); //to remove whitespace from the area name
            text += '<div class="col s12 m6 l4">';
            text += '<a class="waves-effect orangeBg waves-light btn modal-trigger research-faculty" href="#' + areaNS + '" onclick="researchArea(this);" data-area="' + this.areaName + '">' + this.areaName + '</a></div>';
            text += '<div class="modal" id="' + areaNS +'"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="' + areaNS + '-content"></div></div>';
            text += '</div>';
        });
        $('#research-area').html(text); //write to html document
        $('.modal-trigger').leanModal();  //initialize modal
    });
}

// fucntion to populate modal with research details
function researchArea(dom){
    var area = '#'+$(dom).attr('data-area'); //getting attribute value to make ajax call for specific data
    console.log(area);
    var areaNS = ''; //variable to store value without space
    var areaES = ''; //variable to store value without %20 instead of space to make api call
    //replace whitespace to use the research area in api call
    if (area == "#Health Informatics"){
        areaNS = "#HealthInformatics";
        areaES = "Health%20Informatics";
    }
    else if (area == "#System Administration"){
        areaNS = "#SystemAdministration";
        areaES = "System%20Administration";
    }
    else if (area == "#Ubiquitous Computing"){
        areaNS = "#UbiquitousComputing";
        areaES = "Ubiquitous%20Computing";
    }
    else {
        areaNS = area;
        areaES = $(dom).attr('data-area');
    }

    myXhr('get', {path:'/research/byInterestArea/areaName=' + areaES}, areaNS+'-content').done(function(json){
        var text = ''; //variable to store html
        text += '<h2 style="color:black;">' + json.areaName + '</h2>';
        text += '<ul class="research-area">';
        $.each(json.citations, function(){ //loop to get multiple research papers
            text += '<li>' + this + '</li>';
        });
        text += '</ul>';
        $(areaNS+'-content').html(text); //write to modal
    });
}

// function to display faculty's research
function researchFaculty(){
    myXhr('get', {path:'/research/'}, '#research-faculty').done(function(json){
        var text = ''; //variable to store html
        $.each(json.byFaculty, function(){
            text += '<div class="col s12 m6 l4">';
            text += '<a class="waves-effect waves-light btn orangeBg modal-trigger research-faculty" href="#' + this.username + '" onclick="specResearchFaculty(this);" data-facultyName="' + this.username + '">' + this.facultyName + '</a></div>';
            text += '<div class="modal" id="' + this.username +'"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="' + this.username + '-content"></div></div>';
            text += '</div>';
        });
        $('#research-faculty').html(text); //write to html document
        $('.modal-trigger').leanModal(); //initialize modal
    });
}

// fucntion to populate modal with research details
function specResearchFaculty(dom){
    var facultyName = '#'+$(dom).attr('data-facultyName'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/research/byFaculty/username=' + $(dom).attr('data-facultyName')}, facultyName+'-content').done(function(json){
        var text = ''; //variable to store html
        text += '<h2 style="color: black;">' + json.facultyName + '</h2>';
        text += '<ul class="research-area">';
        $.each(json.citations, function(){  //loop to get multiple research papers
            text += '<li>' + this + '</li>';
        });
        text += '</ul>';
        $(facultyName+'-content').html(text); //write to modal
    });
}

// function to display student resources
function resources(){
    var i = 0;
    myXhr('get', {path:'/resources/'}, '#resources').done(function(json){
        var text = ''; //variable to html
        text += '<h2>' + json.title + '</h2><p class="center-align">' + json.subTitle + '</p>';
        text += '<div class="col s12 m6 l4">'; //study abroad
        text += '<a class="waves-effect waves-light btn orangeBg modal-trigger student-resources" href="#studyAbroad" onclick="studyAbroad(this);" data-resourceType="studyAbroad">' + json.studyAbroad.title + '</a></div>';
        text += '<div class="modal" id="studyAbroad"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="studyAbroad-content"></div></div>';
        text += '</div>';
        text += '<div class="col s12 m6 l4">'; //advising
        text += '<a class="waves-effect waves-light btn orangeBg modal-trigger student-resources" href="#studentServices" onclick="studentServices(this);" data-resourceType="studentServices">' + json.studentServices.title + '</a></div>';
        text += '<div class="modal" id="studentServices"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="studentServices-content"></div></div>';
        text += '</div>';
        text += '<div class="col s12 m6 l4">'; //tutoring and lab
        text += '<a class="waves-effect waves-light btn orangeBg modal-trigger student-resources" href="#tutorsAndLabInformation" onclick="tutorsAndLab(this);" data-resourceType="tutorsAndLabInformation">' + json.tutorsAndLabInformation.title + '</a></div>';
        text += '<div class="modal" id="tutorsAndLabInformation"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="tutorsAndLabInformation-content"></div></div>';
        text += '</div>';
        text += '<div class="col s12 m6 l4">'; //student ambassadors
        text += '<a class="waves-effect waves-light btn orangeBg modal-trigger student-resources" href="#studentAmbassadors" onclick="studentAmbassadors(this);" data-resourceType="studentAmbassadors">' + json.studentAmbassadors.title + '</a></div>';
        text += '<div class="modal" id="studentAmbassadors"><span class="right"><a href="#!" class="modal-action modal-close x-close"><i class="fa fa-times" aria-hidden="true"></i></a></span><div class="modal-content" id="studentAmbassadors-content"></div></div>';
        text += '</div>';
        $('#resources').html(text); //write to html document
        $('.modal-trigger').leanModal(); //initialize modal
    });
}

// fucntion to populate modal with study abroad details
function studyAbroad(dom){
    var resourceType = '#'+$(dom).attr('data-resourceType'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/resources/' + $(dom).attr('data-resourceType')}, resourceType+'-content').done(function(json){
        var text = ''; //variable to store html
        text += '<h3 style="color:black;">' + json.studyAbroad.title + '</h3><p>' + json.studyAbroad.description + '</p>';
        $.each(json.studyAbroad.places, function(){ //loop to get multiple places
            text += '<h4 class="left-align">' + this.nameOfPlace + '</h4><p>' + this.description + '</p>';
        });
        $(resourceType+'-content').html(text); //write to modal
    });
}

// fucntion to populate modal with advising details
function studentServices(dom){
    var resourceType = '#'+$(dom).attr('data-resourceType'); //getting attribute value to make ajax call for specific data

    myXhr('get', {path:'/resources/' + $(dom).attr('data-resourceType')}, resourceType+'-content').done(function(json){
        var text = ''; //variable to store html
        text += '<h3 style="color:black;">' + json.studentServices.title + '</h3>';
        text += '<h4>' + json.studentServices.academicAdvisors.title + '</h4><p>' + json.studentServices.academicAdvisors.description + '</p>';
        text += '<p><a class="waves-effect waves-light btn modal-trigger" href="' + json.studentServices.academicAdvisors.faq.contentHref + '">Advising FAQ</a></p>';
        text += '<h4>' + json.studentServices.professonalAdvisors.title + '</h4>';
        $.each(json.studentServices.professonalAdvisors.advisorInformation, function(){ //loop to get multiple advisor details
            text += '<h5>' + this.name + '</h5><ul class="advisors">';
            text += '<li><i class="fa fa-thumb-tack" aria-hidden="true"></i>' + this.department + '</li>';
            text += '<li><i class="fa fa-envelope" aria-hidden="true"></i><a href="mailto:' + this.email + '">' + this.email + '</a></li></ul>';
        });
        text += '<h4>' + json.studentServices.facultyAdvisors.title + '</h4><p>' + json.studentServices.facultyAdvisors.description + '</p>';
        text += '<h4>' + json.studentServices.istMinorAdvising.title + '</h4>';
        $.each(json.studentServices.istMinorAdvising.minorAdvisorInformation, function(){ //loop to get multiple advisor details
            text += '<h5>' + this.title + '</h5><ul class="advisors">';
            text += '<li><i class="fa fa-user" aria-hidden="true"></i>' + this.advisor + '</li>';
            text += '<li><i class="fa fa-envelope" aria-hidden="true"></i><a href="mailto:' + this.email + '">' + this.email + '</a></li></ul>';
        });
        $(resourceType+'-content').html(text); //write to modal
    });
}

// fucntion to populate modal with tutors details
function tutorsAndLab(dom){
    var resourceType = '#'+$(dom).attr('data-resourceType'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/resources/' + $(dom).attr('data-resourceType')}, resourceType+'-content').done(function(json){
        var text = ''; //variable to store html
        text += '<h3 style="color:black;">' + json.tutorsAndLabInformation.title + '</h3><p>' + json.tutorsAndLabInformation.description + '</p>';
        text += '<p><a class="waves-effect waves-light btn modal-trigger" href="' + json.tutorsAndLabInformation.tutoringLabHoursLink + '">Tutoring and Lab Hours</a></p>';
        $(resourceType+'-content').html(text); //write to modal
    });
}

// fucntion to populate modal with student ambassadors details
function studentAmbassadors(dom){
    var resourceType = '#'+$(dom).attr('data-resourceType'); //getting attribute value to make ajax call for specific data
    myXhr('get', {path:'/resources/' + $(dom).attr('data-resourceType')}, resourceType+'-content').done(function(json){
        var text = ''; //variable to store html
        text += '<h3 style="color:black;">' + json.studentAmbassadors.title + '</h3>';
        $.each(json.studentAmbassadors.subSectionContent, function(){ //loop to get multiple student ambassadors
            text += '<h4>' + this.title + '</h4><p>' + this.description + '</p>'; 
        });
        text += '<p><a class="waves-effect waves-light btn modal-trigger" href="' + json.studentAmbassadors.applicationFormLink + '">Application Form</a></p>';
        $(resourceType+'-content').html(text); //write to modal
    });
}

// fucntion to display footer details
function footer(){
    myXhr('get', {path:'/footer/'}, '#footer').done(function(json){
        var l_text = ''; //variable to store left part of footer
        var r_text = '';  //variable to store right part of footer
        var b_text = ''; //variale to store bottom part of footer
        l_text += '<h4>' + json.social.title + '</h4>';
        l_text += '<a href="' + json.social.twitter + '" class="social"><i class="fa fa-twitter fa-4x" aria-hidden="true"></i></a>';
        l_text += '<a href="' + json.social.facebook + '" class="social"><i class="fa fa-facebook fa-4x" aria-hidden="true"></i></a>';
        r_text += '<ul>';
        $.each(json.quickLinks, function(){
            r_text += '<li class="quickLinks"><a href="' + this.href + '">' + this.title + '</a></li>';
        });
        r_text += '</ul>';
        b_text += '<div class="container">'+json.copyright.html+'</div>';
        $('#footer-left').html(l_text);  //write to html document
        $('#footer-right').html(r_text);
        $('#footer-bottom').html(b_text);
    });

}

// ajax call using the proxy link
function myXhr(t, d, id){
    return $.ajax({
        type: t,
        url: 'http://solace.ist.rit.edu/~plgics/proxy.php', 
        dataType: 'json', 
        data: d,
        cache: false,
        async: true,
        beforeSend: function(){
            $(id).append('<img src="img/gears.gif" class="spin"/>');
        }
        }).always(function(){ 
        $(id).find('.spin').fadeOut(500, function(){
            $(this).remove();
        });
    }).fail(function(){
    });
}