// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'technology.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TechnologyImpl _$$TechnologyImplFromJson(Map<String, dynamic> json) =>
    _$TechnologyImpl(
      name: json['name'] as String,
      imageUrl: json['imageUrl'] as String,
      refImage: json['refImage'] as String?,
      id: json['id'] as String? ?? '',
      experienceTime: json['experienceTime'] as String? ?? '',
    );

Map<String, dynamic> _$$TechnologyImplToJson(_$TechnologyImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'imageUrl': instance.imageUrl,
      'refImage': instance.refImage,
      'id': instance.id,
      'experienceTime': instance.experienceTime,
    };
