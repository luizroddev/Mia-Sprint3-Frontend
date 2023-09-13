interface Step {
    [step: string]: string[];
}

interface Screens {
    screens: string[];
}

interface Images {
    screens: {
        err: null | string;
        images: { [key: string]: string };
    };
}

interface IAnswer {
    steps: {
        appName: string;
        question: string;
        steps: Step;
        screens: string[];
        elements: string[];
    };
    images: Images;
}