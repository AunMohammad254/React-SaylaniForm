import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Clock } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: 'Quality Education',
      description: 'Learn from industry experts with hands-on practical training'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Expert Instructors',
      description: 'Learn from experienced professionals in their respective fields'
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: 'Industry Certification',
      description: 'Get certified with recognized industry standard certificates'
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: 'Flexible Schedule',
      description: 'Choose from morning, evening, or weekend classes'
    }
  ];

  const courses = [
    {
      title: 'Web & Mobile App Development',
      duration: '6 Months',
      description: 'Learn full-stack development with modern technologies',
      level: 'Beginner to Advanced'
    },
    {
      title: 'Digital Marketing',
      duration: '3 Months',
      description: 'Master digital marketing strategies and tools',
      level: 'All Levels'
    },
    {
      title: 'Graphic Design',
      duration: '4 Months',
      description: 'Create stunning designs with industry-standard tools',
      level: 'Beginner to Intermediate'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Saylani SMIT
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Empowering youth with quality education and practical skills for a brighter future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Registration
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Student Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Saylani SMIT?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide quality education with practical training to help you succeed in your career
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Courses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of courses designed to meet industry demands
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.duration}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {course.description}
                  </p>
                  <Link
                    to="/register"
                    className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with Saylani SMIT
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;