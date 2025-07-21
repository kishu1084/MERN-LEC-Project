import {React, useState} from 'react';
import { Card, Table, Button } from 'react-bootstrap';

const CourseComparison = ({name}) => {
    const [showMore, setShowMore] = useState(false);
  const comparisonData = [
    {
      feature: "Course Fee",
      lec: `✅ ${name} free course – No hidden costs!`,
      others: "❌ Paid courses with limited free access",
    },
    {
      feature: "Comprehensive Learning",
      lec: `✅ Covers the ${name} syllabus, from analytics to pricing strategies`,
      others: "❌ Mostly theoretical content with minimal industry applications",
    },
    {
      feature: "Practical & Hands-On Training",
      lec: `✅ Includes real-world projects, case studies, and interactive sessions`,
      others: "❌ Limited hands-on experience or outdated content",
    },
    {
      feature: "Beginner-Friendly & Advanced Content",
      lec: "✅ Ideal for students, professionals, and business owners",
      others: "❌ Often requires prior technical experience",
    },
  ];

  return (
    <>
        {showMore &&(<Card className="w-100 my-5 px-3 py-4 border-0">
        <h3 className="text-start fw-bold mb-4 text-black">How we compare to other platforms</h3>

        <Table responsive bordered className="text-start border-black">
            <thead className="table-light border-black bg-white text-center">
            <tr>
                <th>Feature</th>
                <th>SSM LEC (This Course)</th>
                <th>Other Platforms</th>
            </tr>
            </thead>
            <tbody>
            {comparisonData.map((item, idx) => (
                <tr key={idx}>
                <td className="fw-semibold p-3">{item.feature}</td>
                <td className="text-black p-3">{item.lec}</td>
                <td className="text-black p-3">{item.others}</td>
                </tr>
            ))}
            </tbody>
        </Table>
        </Card>)}
        <div className='mt-3 text-end'>
        <Button
          className="border-0 text-danger bg-transparent text-decoration-underline fs-5"
          onClick={() => setShowMore(!showMore)}
        >
          <strong>{showMore ? 'Read Less' : 'Read More'}</strong>
        </Button>
      </div>
    </>
  );
};

export default CourseComparison;
