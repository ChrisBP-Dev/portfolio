// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact_message.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ContactMessageImpl _$$ContactMessageImplFromJson(Map<String, dynamic> json) =>
    _$ContactMessageImpl(
      name: json['name'] as String,
      email: json['email'] as String,
      message: json['message'] as String,
      phoneNumber: ContactPhoneNumber.fromJson(
        json['phoneNumber'] as Map<String, dynamic>,
      ),
      sendThrough:
          $enumDecodeNullable(_$SendThroughEnumMap, json['sendThrough']) ??
              SendThrough.whatsapp,
    );

Map<String, dynamic> _$$ContactMessageImplToJson(
  _$ContactMessageImpl instance,
) =>
    <String, dynamic>{
      'name': instance.name,
      'email': instance.email,
      'message': instance.message,
      'phoneNumber': instance.phoneNumber,
      'sendThrough': _$SendThroughEnumMap[instance.sendThrough],
    };

const _$SendThroughEnumMap = {
  SendThrough.email: 'email',
  SendThrough.whatsapp: 'whatsapp',
};
