import { IsString ,IsNotEmpty,Length} from "class-validator";

export class SigninUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(5,20,{
        // $value:当前用户传入的值
        // $property:当前属性名
        // $target:当前类
        // $constraint1:最小长度
        message:`用户名长度必须在$constraint1到$constraint12之间,当前传递的值是$value.`
    })
    username:string

    @IsString()
    @IsNotEmpty()
    @Length(5,20,{
        message:`密码长度必须在$constraint1到$constraint12之间,当前传递的值是$value.`
    })
    password:string

    @IsString()
    @IsNotEmpty()
    @Length(4,4,{
        message:'验证码长度错误'
    })
    verification:string
}