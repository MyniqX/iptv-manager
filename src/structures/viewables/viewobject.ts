import { Icons } from "@/components/views/SvgView.vue";
import { GroupObject } from "./groups/groupobject";
import { EList } from "@/utils/elist";

export class ViewObject {
    public Name: string = "";
    public Logo: string = "";
    public UpperLevel?: GroupObject;


    public LogoPercent: number = 0.0;

    public isSticky: boolean = false;
    public AddedDate: Date | undefined = undefined;

    get TitleIcon(): string { return Icons.folder; }
    get Title(): string {
        return "Group";
    }
}
