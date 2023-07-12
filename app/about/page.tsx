import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const about = () => {
  return (
    <div className="flex flex-col w-1/2 gap-10 text-upenn-blue">
      <div>
        <div className="text-2xl font-bold">
          <h1>ABOUT US:</h1>
        </div>
        <div>
          <p className="text-xl font-normal tracking-wide">
            Introducing a digital platform that facilitates in-person
            gatherings, our student meet-up app empowers online students to
            design and join a range of events. Users can provide an outline for
            each gathering, detailing its purpose, location, and schedule, as
            well as initiate conversations about the agenda, share photos, and
            engage in related dialogues. Following the conclusion of each
            meetup, the details will be preserved in an archive, allowing
            individuals to revisit the fond memories of past events.
          </p>
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold">
          <h1>FOUNDING FATHERS:</h1>
        </div>
        <div className=" flex gap-4 text-xl font-normal flex-col">
          <div>
          <div className="image-cropper">
              <Image
                src="/assets/images/bonnie.jpg"
                alt="Bonnie Tse"
                width={400}
                height={400}
              />
            </div>
            Bonnie Tse
            <div className="flex gap-4 text-upenn-red">
              <span className="bannerIcon">
                <a
                  href="https://www.linkedin.com/in/bonnietse/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
              </span>
              <span className="bannerIcon">
                <a
                  href="https://github.com/bonniewt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>
              </span>
            </div>
          </div>
          <div>
            <div className="image-cropper">
              <Image
                src="/assets/images/kyle.jpg"
                alt="Kyle Li"
                width={400}
                height={400}
              />
            </div>
            Kyle Li
            <div className="flex gap-4 text-upenn-red">
              <span className="bannerIcon">
                <a
                  href="https://www.linkedin.com/in/kyleguanyili/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
              </span>
              <span className="bannerIcon">
                <a
                  href="https://github.com/kyle-guanyi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>
              </span>
            </div>
          </div>
          <div>
          <div className="image-cropper">
              <Image
                src="/assets/images/kevin.jpg"
                alt="Kevin Nguyen"
                width={400}
                height={400}
              />
            </div>
            <div></div>
            Kevin Nguyen
            <div className="flex gap-4 text-upenn-red">
              <span className="bannerIcon">
                <a
                  href="https://www.linkedin.com/in/kevin-ucsb/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                </a>
              </span>
              <span className="bannerIcon">
                <a
                  href="https://github.com/kebinjpeg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default about;
