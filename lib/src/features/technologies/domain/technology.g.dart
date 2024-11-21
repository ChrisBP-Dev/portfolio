// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'technology.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TechnologyImpl _$$TechnologyImplFromJson(Map<String, dynamic> json) =>
    _$TechnologyImpl(
      name: json['name'] as String,
      image: ImageAndPath.fromJson(json['image'] as Map<String, dynamic>),
      id: json['id'] as String? ?? '',
      experienceTime: json['experienceTime'] as String? ?? '',
    );

Map<String, dynamic> _$$TechnologyImplToJson(_$TechnologyImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'image': instance.image.toJson(),
      'id': instance.id,
      'experienceTime': instance.experienceTime,
    };
